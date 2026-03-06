"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { sendOemInvitationEmail } from "@/lib/email/send";
import { revalidatePath } from "next/cache";

export async function createInvitation(formData: FormData) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.profile.role !== "admin") {
    return { error: "権限がありません" };
  }

  const email = formData.get("email") as string;
  const companyName = formData.get("companyName") as string;
  const message = formData.get("message") as string | null;

  if (!email || !companyName) {
    return { error: "メールアドレスと会社名は必須です" };
  }

  const supabase = await createClient();

  // 重複チェック（同じメールで有効な招待がないか）
  const { data: existing } = await supabase
    .from("oem_invitations")
    .select("id")
    .eq("email", email)
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .single();

  if (existing) {
    return { error: "このメールアドレスには既に有効な招待があります" };
  }

  const { data: invitation, error } = await supabase
    .from("oem_invitations")
    .insert({
      email,
      company_name: companyName,
      message: message || null,
      inviter_id: currentUser.authUser.id,
    })
    .select()
    .single();

  if (error) {
    return { error: "招待の作成に失敗しました" };
  }

  // 招待メール送信
  await sendOemInvitationEmail(email, {
    companyName,
    inviterMessage: message || undefined,
    token: invitation.token,
  });

  revalidatePath("/admin/invitations");
  return { success: true };
}

export async function cancelInvitation(invitationId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.profile.role !== "admin") {
    return { error: "権限がありません" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("oem_invitations")
    .update({ status: "cancelled" })
    .eq("id", invitationId)
    .eq("status", "pending");

  if (error) {
    return { error: "招待のキャンセルに失敗しました" };
  }

  revalidatePath("/admin/invitations");
  return { success: true };
}

export async function resendInvitation(invitationId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.profile.role !== "admin") {
    return { error: "権限がありません" };
  }

  const supabase = await createClient();

  const { data: invitation } = await supabase
    .from("oem_invitations")
    .select("*")
    .eq("id", invitationId)
    .eq("status", "pending")
    .single();

  if (!invitation) {
    return { error: "招待が見つかりません" };
  }

  // 期限を更新して再送
  await supabase
    .from("oem_invitations")
    .update({
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq("id", invitationId);

  await sendOemInvitationEmail(invitation.email, {
    companyName: invitation.company_name,
    inviterMessage: invitation.message || undefined,
    token: invitation.token,
  });

  revalidatePath("/admin/invitations");
  return { success: true };
}
