const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://foodoem-connect.vercel.app";

interface InquiryNotificationProps {
  oemCompanyName: string;
  restaurantName: string;
  projectTitle: string;
  message: string;
  inquiryId: string;
}

export function renderInquiryNotification(props: InquiryNotificationProps) {
  const { oemCompanyName, restaurantName, projectTitle, message, inquiryId } =
    props;

  return {
    subject: `【FoodOEM Connect】新しい問い合わせが届きました`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
  <div style="border-bottom: 3px solid #EA580C; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #111827; margin: 0;">FoodOEM <span style="color: #EA580C;">Connect</span></h1>
  </div>

  <p>${oemCompanyName} 様</p>

  <p>新しい問い合わせが届きました。</p>

  <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;">案件名</p>
    <p style="margin: 0 0 16px; font-weight: bold;">${projectTitle}</p>
    <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;">飲食店</p>
    <p style="margin: 0 0 16px; font-weight: bold;">${restaurantName}</p>
    ${message ? `<p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;">メッセージ</p><p style="margin: 0;">${message.slice(0, 200)}</p>` : ""}
  </div>

  <a href="${SITE_URL}/oem/inquiries/${inquiryId}" style="display: inline-block; background: #EA580C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
    問い合わせを確認する
  </a>

  <p style="margin-top: 32px; font-size: 12px; color: #9CA3AF;">
    このメールはFoodOEM Connectから自動送信されています。
    <br>メール通知を停止するには、設定画面から変更してください。
  </p>
</body>
</html>`,
  };
}
