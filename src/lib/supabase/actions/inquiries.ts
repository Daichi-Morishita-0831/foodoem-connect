"use server";

import { createClient } from "../server";

/**
 * 問い合わせ送信 + 工場情報開示（DB関数でアトミック実行）
 */
export async function submitInquiry(
  matchResultId: string,
  message: string = ""
): Promise<{ inquiryId: string } | { error: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("submit_inquiry", {
    p_match_result_id: matchResultId,
    p_message: message,
  });

  if (error) {
    console.error("submitInquiry error:", error);
    if (error.message.includes("already submitted")) {
      return { error: "すでに問い合わせ済みです" };
    }
    return { error: "問い合わせの送信に失敗しました" };
  }

  return { inquiryId: data as string };
}

/**
 * OEMが問い合わせに回答（承認/却下）
 */
export async function respondToInquiry(
  inquiryId: string,
  status: "approved" | "rejected"
): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  // 問い合わせ詳細を取得
  const { data: inquiry, error: fetchError } = await supabase
    .from("inquiries")
    .select("id, match_result_id, restaurant_id, status")
    .eq("id", inquiryId)
    .single();

  if (fetchError || !inquiry) {
    return { error: "問い合わせが見つかりません" };
  }

  // match_resultを取得
  const { data: matchResult } = await supabase
    .from("match_results")
    .select("id, project_id, oem_profile_id")
    .eq("id", inquiry.match_result_id)
    .single();

  if (!matchResult) {
    return { error: "マッチング結果が見つかりません" };
  }

  // 権限チェック: OEMプロフィールの所有者か
  const { data: oemProfile } = await supabase
    .from("oem_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!oemProfile || oemProfile.id !== matchResult.oem_profile_id) {
    return { error: "この問い合わせに回答する権限がありません" };
  }

  // ステータス更新
  const { error: updateError } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", inquiryId);

  if (updateError) {
    console.error("respondToInquiry error:", updateError);
    return { error: "回答の送信に失敗しました" };
  }

  // 承認時: プロジェクトにOEMを割り当て + ステータス更新
  if (status === "approved") {
    await supabase
      .from("projects")
      .update({
        oem_id: user.id,
        status: "negotiation",
      })
      .eq("id", matchResult.project_id);
  }

  // 通知作成（飲食店ユーザーへ）
  const notifTitle =
    status === "approved"
      ? "問い合わせが承認されました"
      : "問い合わせが辞退されました";

  await supabase.from("notifications").insert({
    user_id: inquiry.restaurant_id,
    type: "inquiry_responded",
    title: notifTitle,
    body:
      status === "approved"
        ? "工場との商談を開始できます。メッセージを送信してみましょう。"
        : null,
    link: `/projects/${matchResult.project_id}/matches`,
  });

  return { success: true };
}
