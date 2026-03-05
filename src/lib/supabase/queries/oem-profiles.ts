import { createClient } from "../server";
import type { OemProfile } from "@/types";

/**
 * 現在ログイン中のOEMユーザーのプロフィールを取得
 */
export async function getMyOemProfile(): Promise<OemProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("oem_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("getMyOemProfile error:", error);
    return null;
  }

  return data as OemProfile;
}
