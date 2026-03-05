import { createClient } from "./server";
import type { User } from "@/types";

export type AuthUser = {
  authUser: { id: string; email: string };
  profile: User;
};

/**
 * サーバーサイドで認証ユーザー + プロフィールを取得
 * 未認証の場合は null を返す
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile) return null;

  return {
    authUser: { id: authUser.id, email: authUser.email ?? "" },
    profile: profile as User,
  };
}
