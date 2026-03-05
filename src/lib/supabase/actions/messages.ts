"use server";

import { createClient } from "../server";

/**
 * メッセージを送信
 */
export async function sendMessage(
  projectId: string,
  content: string
): Promise<{ messageId: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const { data, error } = await supabase
    .from("messages")
    .insert({
      project_id: projectId,
      sender_id: user.id,
      content,
    })
    .select("id")
    .single();

  if (error) {
    console.error("sendMessage error:", error);
    return { error: "メッセージの送信に失敗しました" };
  }

  // 相手ユーザーに通知
  const { data: project } = await supabase
    .from("projects")
    .select("restaurant_id, oem_id, title")
    .eq("id", projectId)
    .single();

  if (project) {
    const recipientId =
      project.restaurant_id === user.id
        ? project.oem_id
        : project.restaurant_id;

    if (recipientId) {
      await supabase.from("notifications").insert({
        user_id: recipientId,
        type: "new_message",
        title: "新しいメッセージが届きました",
        body: content.substring(0, 100),
        link: `/messages/${projectId}`,
      });
    }
  }

  return { messageId: data.id };
}
