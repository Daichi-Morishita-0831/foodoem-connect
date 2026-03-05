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
