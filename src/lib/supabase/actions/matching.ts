"use server";

import { createClient } from "../server";
import { calculateMatchScore } from "@/lib/matching/calculate-score";
import type { RecipeSpec, OemProfile } from "@/types";

/**
 * マッチング実行: 全OEMプロフィールとスコア計算 → match_resultsに保存
 */
export async function runMatching(
  projectId: string
): Promise<{ matchCount: number } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // プロジェクトの最新レシピ仕様書を取得
  const { data: spec, error: specError } = await supabase
    .from("recipe_specs")
    .select("*")
    .eq("project_id", projectId)
    .order("version", { ascending: false })
    .limit(1)
    .single();

  if (specError || !spec) {
    return { error: "レシピ仕様書が見つかりません" };
  }

  // アクティブなOEMプロフィールを全取得
  const { data: profiles, error: profileError } = await supabase
    .from("oem_profiles")
    .select("*")
    .eq("is_active", true);

  if (profileError || !profiles || profiles.length === 0) {
    return { error: "マッチ可能な工場が見つかりません" };
  }

  // 既存のマッチング結果をクリア
  await supabase
    .from("match_results")
    .delete()
    .eq("project_id", projectId);

  // 各OEMプロフィールとスコア計算
  const matchResults = profiles.map((profile) => {
    const { score, reasons } = calculateMatchScore(
      spec as unknown as RecipeSpec,
      profile as unknown as OemProfile
    );
    return {
      project_id: projectId,
      oem_profile_id: profile.id,
      match_score: score,
      match_reasons: reasons,
    };
  });

  // スコアが30以上のみ保存（最大10件）
  const filteredResults = matchResults
    .filter((r) => r.match_score >= 30)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);

  if (filteredResults.length === 0) {
    return { error: "条件に合う工場が見つかりませんでした" };
  }

  const { error: insertError } = await supabase
    .from("match_results")
    .insert(filteredResults);

  if (insertError) {
    console.error("insertMatchResults error:", insertError);
    return { error: "マッチング結果の保存に失敗しました" };
  }

  // プロジェクトステータスを "matching" に更新
  await supabase
    .from("projects")
    .update({ status: "matching" })
    .eq("id", projectId);

  return { matchCount: filteredResults.length };
}
