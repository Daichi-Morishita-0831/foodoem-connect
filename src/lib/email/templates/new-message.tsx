const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://foodoem-connect.vercel.app";

interface NewMessageProps {
  recipientName: string;
  senderName: string;
  projectTitle: string;
  messagePreview: string;
  projectId: string;
}

export function renderNewMessage(props: NewMessageProps) {
  const { recipientName, senderName, projectTitle, messagePreview, projectId } =
    props;

  return {
    subject: `【FoodOEM Connect】${senderName}さんからメッセージが届きました`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
  <div style="border-bottom: 3px solid #EA580C; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #111827; margin: 0;">FoodOEM <span style="color: #EA580C;">Connect</span></h1>
  </div>

  <p>${recipientName} 様</p>

  <p>「${projectTitle}」で新しいメッセージが届きました。</p>

  <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;">${senderName}さん:</p>
    <p style="margin: 0; font-style: italic;">"${messagePreview.slice(0, 200)}"</p>
  </div>

  <a href="${SITE_URL}/messages/${projectId}" style="display: inline-block; background: #EA580C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
    メッセージを確認する
  </a>

  <p style="margin-top: 32px; font-size: 12px; color: #9CA3AF;">
    このメールはFoodOEM Connectから自動送信されています。
  </p>
</body>
</html>`,
  };
}
