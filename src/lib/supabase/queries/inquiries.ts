import { createClient } from "../server";
import type { InquiryWithDetails, MatchResult, Inquiry } from "@/types";

/**
 * OEM工場宛の問い合わせ一覧を取得
 */
export async function getInquiriesForOem(): Promise<InquiryWithDetails[]> {
  const supabase = await createClient();

  // まず現在ユーザーのOEMプロフィールIDを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: oemProfile } = await supabase
    .from("oem_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!oemProfile) return [];

  // 問い合わせ一覧（match_results経由で自分のOEMプロフィールに紐づくもの）
  const { data, error } = await supabase
    .from("inquiries")
    .select(
      `
      *,
      match_result:match_results!match_result_id (
        id,
        project_id,
        oem_profile_id,
        match_score,
        match_reasons,
        is_revealed,
        revealed_at,
        created_at,
        project:projects!project_id (
          id,
          restaurant_id,
          title,
          status,
          created_at,
          updated_at
        )
      ),
      restaurant:users!restaurant_id (
        id,
        role,
        company_name,
        representative_name,
        phone,
        address,
        is_active,
        created_at,
        updated_at
      )
    `
    )
    .eq("match_result.oem_profile_id", oemProfile.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getInquiriesForOem error:", error);
    return [];
  }

  // match_resultがnullのものを除外（JOINフィルタでnullになる可能性あり）
  return (data ?? [])
    .filter((row) => row.match_result !== null)
    .map((row) => ({
      id: row.id,
      match_result_id: row.match_result_id,
      restaurant_id: row.restaurant_id,
      message: row.message,
      status: row.status,
      created_at: row.created_at,
      restaurant: row.restaurant ?? undefined,
      project: row.match_result?.project ?? undefined,
      match_result: row.match_result
        ? {
            id: row.match_result.id,
            project_id: row.match_result.project_id,
            oem_profile_id: row.match_result.oem_profile_id,
            match_score: row.match_result.match_score,
            match_reasons: row.match_result.match_reasons as MatchResult["match_reasons"],
            is_revealed: row.match_result.is_revealed,
            revealed_at: row.match_result.revealed_at,
            created_at: row.match_result.created_at,
          }
        : undefined,
    })) as InquiryWithDetails[];
}

/**
 * 問い合わせ詳細（OEM視点: レシピ仕様含む）
 */
export async function getInquiryDetail(
  inquiryId: string
): Promise<InquiryWithDetails | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      `
      *,
      match_result:match_results!match_result_id (
        id,
        project_id,
        oem_profile_id,
        match_score,
        match_reasons,
        is_revealed,
        revealed_at,
        created_at
      ),
      restaurant:users!restaurant_id (
        id,
        role,
        company_name,
        representative_name,
        phone,
        address,
        is_active,
        created_at,
        updated_at
      )
    `
    )
    .eq("id", inquiryId)
    .single();

  if (error || !data) {
    console.error("getInquiryDetail error:", error);
    return null;
  }

  // レシピ仕様を取得
  let recipeSpec = undefined;
  let project = undefined;
  if (data.match_result) {
    const { data: proj } = await supabase
      .from("projects")
      .select("*")
      .eq("id", data.match_result.project_id)
      .single();
    project = proj ?? undefined;

    const { data: spec } = await supabase
      .from("recipe_specs")
      .select("*")
      .eq("project_id", data.match_result.project_id)
      .order("version", { ascending: false })
      .limit(1)
      .single();
    recipeSpec = spec ?? undefined;
  }

  return {
    id: data.id,
    match_result_id: data.match_result_id,
    restaurant_id: data.restaurant_id,
    message: data.message,
    status: data.status,
    created_at: data.created_at,
    restaurant: data.restaurant ?? undefined,
    project,
    recipe_spec: recipeSpec,
    match_result: data.match_result
      ? {
          id: data.match_result.id,
          project_id: data.match_result.project_id,
          oem_profile_id: data.match_result.oem_profile_id,
          match_score: data.match_result.match_score,
          match_reasons: data.match_result.match_reasons as MatchResult["match_reasons"],
          is_revealed: data.match_result.is_revealed,
          revealed_at: data.match_result.revealed_at,
          created_at: data.match_result.created_at,
        }
      : undefined,
  } as InquiryWithDetails;
}

/**
 * OEMの問い合わせ統計
 */
export async function getOemInquiryStats(): Promise<{
  pending: number;
  approved: number;
  total: number;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { pending: 0, approved: 0, total: 0 };

  const { data: oemProfile } = await supabase
    .from("oem_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!oemProfile) return { pending: 0, approved: 0, total: 0 };

  const { data, error } = await supabase
    .from("inquiries")
    .select(
      `
      status,
      match_result:match_results!match_result_id (
        oem_profile_id
      )
    `
    )
    .eq("match_result.oem_profile_id", oemProfile.id);

  if (error || !data) return { pending: 0, approved: 0, total: 0 };

  const filtered = data.filter((row) => row.match_result !== null);

  return {
    pending: filtered.filter((r) => r.status === "pending").length,
    approved: filtered.filter((r) => r.status === "approved").length,
    total: filtered.length,
  };
}
