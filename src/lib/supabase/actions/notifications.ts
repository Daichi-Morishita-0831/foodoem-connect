"use server";

import { createClient } from "../server";
import type { NotificationType } from "@/types";

/**
 * 通知を既読にする
 */
export async function markNotificationRead(
  notificationId: string
): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);
}

/**
 * 全通知を既読にする
 */
export async function markAllNotificationsRead(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);
}

/**
 * 通知を作成（サーバーサイドから呼び出し用）
 */
export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body?: string,
  link?: string
): Promise<void> {
  const supabase = await createClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    body: body ?? null,
    link: link ?? null,
  });
}
