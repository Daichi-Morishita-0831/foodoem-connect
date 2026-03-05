import { createClient } from "../server";
import type { Project, RecipeSpec } from "@/types";

/**
 * ログインユーザーの案件一覧を取得
 */
export async function getMyProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getMyProjects error:", error);
    return [];
  }

  return data as Project[];
}

/**
 * 案件詳細を取得
 */
export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProject error:", error);
    return null;
  }

  return data as Project;
}

/**
 * 案件のレシピ仕様書を取得（最新バージョン）
 */
export async function getRecipeSpec(
  projectId: string
): Promise<RecipeSpec | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipe_specs")
    .select("*")
    .eq("project_id", projectId)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("getRecipeSpec error:", error);
    return null;
  }

  return data as RecipeSpec;
}
