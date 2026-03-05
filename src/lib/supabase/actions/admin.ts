"use server";

import { createClient } from "../server";

/**
 * ユーザーの有効/無効を切り替え
 */
export async function toggleUserActive(
  userId: string,
  isActive: boolean
): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  // Admin権限チェック
  const { data: adminProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminProfile?.role !== "admin") {
    return { error: "管理者権限が必要です" };
  }

  const { error } = await supabase
    .from("users")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) {
    console.error("toggleUserActive error:", error);
    return { error: "ユーザー状態の更新に失敗しました" };
  }

  return { success: true };
}
