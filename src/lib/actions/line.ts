"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { revalidatePath } from "next/cache";

export async function unlinkLineAccount() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { error: "認証が必要です" };
  }

  const supabase = await createClient();

  // ユーザーメタデータからLINE情報を削除
  const { data: user } = await supabase.auth.admin.getUserById(
    currentUser.authUser.id
  );

  if (!user?.user) {
    return { error: "ユーザーが見つかりません" };
  }

  const metadata = { ...user.user.user_metadata };
  delete metadata.line_user_id;
  delete metadata.provider;

  const { error } = await supabase.auth.admin.updateUserById(
    currentUser.authUser.id,
    { user_metadata: metadata }
  );

  if (error) {
    return { error: "LINE連携の解除に失敗しました" };
  }

  revalidatePath("/settings/line");
  return { success: true };
}

export async function getLineStatus() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  const supabase = await createClient();
  const { data } = await supabase.auth.admin.getUserById(
    currentUser.authUser.id
  );

  if (!data?.user) return null;

  const lineUserId = data.user.user_metadata?.line_user_id;
  const displayName = data.user.user_metadata?.display_name;

  return lineUserId
    ? { linked: true as const, displayName: displayName || "LINE User" }
    : { linked: false as const };
}
