import { resend, FROM_EMAIL } from "./resend";
import { renderInquiryNotification } from "./templates/inquiry-notification";
import { renderInquiryResponse } from "./templates/inquiry-response";
import { renderNewMessage } from "./templates/new-message";
import { renderOemInvitation } from "./templates/oem-invitation";
import { createClient } from "@/lib/supabase/server";

async function isEmailEnabled(userId: string): Promise<{ enabled: boolean; email: string | null }> {
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("email_notification_enabled")
    .eq("id", userId)
    .single();

  const { data: authData } = await supabase.auth.admin.getUserById(userId);

  return {
    enabled: user?.email_notification_enabled !== false,
    email: authData?.user?.email ?? null,
  };
}

/**
 * 問い合わせ通知メール（OEM宛）
 */
export async function sendInquiryEmail(
  oemUserId: string,
  data: {
    oemCompanyName: string;
    restaurantName: string;
    projectTitle: string;
    message: string;
    inquiryId: string;
  }
) {
  try {
    const { enabled, email } = await isEmailEnabled(oemUserId);
    if (!enabled || !email) return;

    const { subject, html } = renderInquiryNotification(data);
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html });
  } catch (error) {
    console.error("sendInquiryEmail error:", error);
  }
}

/**
 * 問い合わせ回答通知メール（飲食店宛）
 */
export async function sendInquiryResponseEmail(
  restaurantUserId: string,
  data: {
    restaurantName: string;
    oemCompanyName: string;
    projectTitle: string;
    status: "approved" | "rejected";
    projectId: string;
  }
) {
  try {
    const { enabled, email } = await isEmailEnabled(restaurantUserId);
    if (!enabled || !email) return;

    const { subject, html } = renderInquiryResponse(data);
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html });
  } catch (error) {
    console.error("sendInquiryResponseEmail error:", error);
  }
}

/**
 * 新着メッセージ通知メール
 */
export async function sendNewMessageEmail(
  recipientUserId: string,
  data: {
    recipientName: string;
    senderName: string;
    projectTitle: string;
    messagePreview: string;
    projectId: string;
  }
) {
  try {
    const { enabled, email } = await isEmailEnabled(recipientUserId);
    if (!enabled || !email) return;

    const { subject, html } = renderNewMessage(data);
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html });
  } catch (error) {
    console.error("sendNewMessageEmail error:", error);
  }
}

/**
 * OEM工場招待メール
 */
export async function sendOemInvitationEmail(
  email: string,
  data: {
    companyName: string;
    inviterMessage?: string;
    token: string;
  }
) {
  try {
    const { subject, html } = renderOemInvitation(data);
    await resend.emails.send({ from: FROM_EMAIL, to: email, subject, html });
  } catch (error) {
    console.error("sendOemInvitationEmail error:", error);
  }
}
