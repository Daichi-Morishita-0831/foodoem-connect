import { createClient } from "../server";
import type { Notification } from "@/types";

/**
 * 通知一覧を取得
 */
export async function getNotifications(
  limit: number = 20
): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getNotifications error:", error);
    return [];
  }

  return (data ?? []) as Notification[];
}

/**
 * 未読通知数を取得
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) {
    console.error("getUnreadNotificationCount error:", error);
    return 0;
  }

  return count ?? 0;
}
