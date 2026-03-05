"use server";

import { createClient } from "./server";

/**
 * プロジェクトファイルをアップロード
 */
export async function uploadProjectFile(
  projectId: string,
  fileName: string,
  fileBuffer: ArrayBuffer,
  contentType: string
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const ext = fileName.split(".").pop() || "bin";
  const path = `${projectId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("project-files")
    .upload(path, fileBuffer, { contentType });

  if (error) {
    console.error("uploadProjectFile error:", error);
    return { error: "ファイルのアップロードに失敗しました" };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("project-files").getPublicUrl(path);

  return { url: publicUrl };
}

/**
 * メッセージ添付ファイルをアップロード
 */
export async function uploadMessageAttachment(
  projectId: string,
  fileName: string,
  fileBuffer: ArrayBuffer,
  contentType: string
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const ext = fileName.split(".").pop() || "bin";
  const path = `${projectId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("message-attachments")
    .upload(path, fileBuffer, { contentType });

  if (error) {
    console.error("uploadMessageAttachment error:", error);
    return { error: "ファイルのアップロードに失敗しました" };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("message-attachments").getPublicUrl(path);

  return { url: publicUrl };
}

/**
 * ファイルを削除
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error("deleteFile error:", error);
    return { error: "ファイルの削除に失敗しました" };
  }

  return { success: true };
}
