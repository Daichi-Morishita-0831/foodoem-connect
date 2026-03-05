import { createClient } from "../server";
import type { Message, Project, User } from "@/types";

export interface Conversation {
  project: Project;
  lastMessage: Message | null;
  otherUser: User | null;
}

/**
 * 現在ユーザーの会話一覧を取得
 */
export async function getConversationList(): Promise<Conversation[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // ユーザーのプロジェクト一覧（negotiation以上のステータス）
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .or(`restaurant_id.eq.${user.id},oem_id.eq.${user.id}`)
    .not("oem_id", "is", null)
    .order("updated_at", { ascending: false });

  if (error || !projects) return [];

  const conversations: Conversation[] = [];

  for (const project of projects) {
    // 最後のメッセージ
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false })
      .limit(1);

    // 相手ユーザー
    const otherUserId =
      project.restaurant_id === user.id
        ? project.oem_id
        : project.restaurant_id;

    let otherUser: User | null = null;
    if (otherUserId) {
      const { data: u } = await supabase
        .from("users")
        .select("*")
        .eq("id", otherUserId)
        .single();
      otherUser = u as User | null;
    }

    conversations.push({
      project: project as Project,
      lastMessage: (msgs?.[0] as Message) ?? null,
      otherUser,
    });
  }

  return conversations;
}

/**
 * プロジェクトのメッセージ一覧を取得
 */
export async function getProjectMessages(
  projectId: string
): Promise<Message[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getProjectMessages error:", error);
    return [];
  }

  return (data ?? []) as Message[];
}
