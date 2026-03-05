import { createClient } from "../server";
import type { MatchResult } from "@/types";

/**
 * 案件のマッチング結果を取得（OEMプロフィールをJOIN）
 */
export async function getMatchResults(
  projectId: string
): Promise<MatchResult[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("match_results")
    .select(
      `
      *,
      oem_profile:oem_profiles (
        id,
        user_id,
        specialties,
        certifications,
        min_lot_size,
        max_lot_size,
        production_area,
        delivery_areas,
        facility_photos,
        description,
        is_active
      )
    `
    )
    .eq("project_id", projectId)
    .order("match_score", { ascending: false });

  if (error) {
    console.error("getMatchResults error:", error);
    return [];
  }

  // Supabase の JOIN 結果を MatchResult 型に変換
  return (data ?? []).map((row) => ({
    id: row.id,
    project_id: row.project_id,
    oem_profile_id: row.oem_profile_id,
    match_score: row.match_score,
    match_reasons: row.match_reasons as MatchResult["match_reasons"],
    is_revealed: row.is_revealed,
    revealed_at: row.revealed_at,
    created_at: row.created_at,
    oem_profile: row.oem_profile ?? undefined,
  }));
}
