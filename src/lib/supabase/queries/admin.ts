import { createClient } from "../server";
import type { User, Project } from "@/types";

export interface AdminStats {
  totalUsers: number;
  totalProjects: number;
  totalMatches: number;
  totalInquiries: number;
}

/**
 * プラットフォーム統計
 */
export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();

  const [users, projects, matches, inquiries] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("match_results").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
  ]);

  return {
    totalUsers: users.count ?? 0,
    totalProjects: projects.count ?? 0,
    totalMatches: matches.count ?? 0,
    totalInquiries: inquiries.count ?? 0,
  };
}

/**
 * 全ユーザー一覧
 */
export async function getAllUsers(): Promise<User[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllUsers error:", error);
    return [];
  }
  return (data ?? []) as User[];
}

/**
 * 全プロジェクト一覧
 */
export async function getAllProjects(): Promise<
  (Project & { restaurant?: User })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      restaurant:users!restaurant_id (
        id, company_name, role
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllProjects error:", error);
    return [];
  }
  return (data ?? []) as (Project & { restaurant?: User })[];
}

/**
 * ユーザー詳細
 */
export async function getUserDetail(
  userId: string
): Promise<(User & { projects?: Project[] }) | null> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) return null;

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .or(`restaurant_id.eq.${userId},oem_id.eq.${userId}`)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    ...(user as User),
    projects: (projects ?? []) as Project[],
  };
}
