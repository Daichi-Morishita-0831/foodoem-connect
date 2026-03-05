import { createClient } from "../server";
import type { Review } from "@/types";

/**
 * 案件のレビュー一覧を取得
 */
export async function getProjectReviews(
  projectId: string
): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjectReviews error:", error);
    return [];
  }
  return (data ?? []) as Review[];
}

/**
 * OEMの平均評価を取得
 */
export async function getOemAverageRating(
  oemUserId: string
): Promise<{ average: number; count: number }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", oemUserId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return {
    average: Math.round((sum / data.length) * 10) / 10,
    count: data.length,
  };
}
