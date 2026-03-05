"use server";

import { createClient } from "../server";
import { sendInquiryEmail, sendInquiryResponseEmail } from "@/lib/email/send";
import { recordProjectEvent } from "./project-events";

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

  const inquiryId = data as string;

  // メール通知 + イベント記録（非同期・失敗してもエラーにしない）
  try {
    const { data: inquiry } = await supabase
      .from("inquiries")
      .select("restaurant_id, match_result_id")
      .eq("id", inquiryId)
      .single();

    if (inquiry) {
      const { data: matchResult } = await supabase
        .from("match_results")
        .select("project_id, oem_profile_id")
        .eq("id", inquiry.match_result_id)
        .single();

      if (matchResult) {
        const { data: oemProfile } = await supabase
          .from("oem_profiles")
          .select("user_id")
          .eq("id", matchResult.oem_profile_id)
          .single();

        const { data: project } = await supabase
          .from("projects")
          .select("title")
          .eq("id", matchResult.project_id)
          .single();

        const { data: restaurant } = await supabase
          .from("users")
          .select("company_name")
          .eq("id", inquiry.restaurant_id)
          .single();

        if (oemProfile && project && restaurant) {
          const { data: oemUser } = await supabase
            .from("users")
            .select("company_name")
            .eq("id", oemProfile.user_id)
            .single();

          await sendInquiryEmail(oemProfile.user_id, {
            oemCompanyName: oemUser?.company_name ?? "",
            restaurantName: restaurant.company_name,
            projectTitle: project.title,
            message,
            inquiryId,
          });
        }

        await recordProjectEvent(
          matchResult.project_id,
          "inquiry_sent",
          inquiry.restaurant_id
        );
      }
    }
  } catch (e) {
    console.error("submitInquiry notification error:", e);
  }

  return { inquiryId };
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

  // メール通知 + イベント記録
  try {
    const { data: project } = await supabase
      .from("projects")
      .select("title")
      .eq("id", matchResult.project_id)
      .single();

    const { data: restaurant } = await supabase
      .from("users")
      .select("company_name")
      .eq("id", inquiry.restaurant_id)
      .single();

    const { data: oemUser } = await supabase
      .from("users")
      .select("company_name")
      .eq("id", user.id)
      .single();

    if (project && restaurant && oemUser) {
      await sendInquiryResponseEmail(inquiry.restaurant_id, {
        restaurantName: restaurant.company_name,
        oemCompanyName: oemUser.company_name,
        projectTitle: project.title,
        status,
        projectId: matchResult.project_id,
      });
    }

    await recordProjectEvent(
      matchResult.project_id,
      "inquiry_responded",
      user.id,
      null,
      status
    );

    if (status === "approved") {
      await recordProjectEvent(
        matchResult.project_id,
        "status_change",
        user.id,
        "matching",
        "negotiation"
      );
    }
  } catch (e) {
    console.error("respondToInquiry notification error:", e);
  }

  return { success: true };
}
