"use server";

import { createClient } from "../server";

interface SubmitReviewInput {
  project_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
}

/**
 * レビューを投稿
 */
export async function submitReview(
  input: SubmitReviewInput
): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  // 重複チェック
  const { data: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("project_id", input.project_id)
    .eq("reviewer_id", user.id)
    .maybeSingle();

  if (existing) {
    return { error: "この案件には既にレビュー済みです" };
  }

  const { error } = await supabase.from("reviews").insert({
    project_id: input.project_id,
    reviewer_id: user.id,
    reviewee_id: input.reviewee_id,
    rating: input.rating,
    comment: input.comment,
  });

  if (error) {
    console.error("submitReview error:", error);
    return { error: "レビューの送信に失敗しました" };
  }

  return { success: true };
}
