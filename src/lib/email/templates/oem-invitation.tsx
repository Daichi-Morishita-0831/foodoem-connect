const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://foodoem-connect.vercel.app";

interface OemInvitationProps {
  companyName: string;
  inviterMessage?: string;
  token: string;
}

export function renderOemInvitation(props: OemInvitationProps) {
  const { companyName, inviterMessage, token } = props;

  return {
    subject: `【FoodOEM Connect】OEM工場としてご登録いただけませんか？`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
  <div style="border-bottom: 3px solid #EA580C; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #111827; margin: 0;">FoodOEM <span style="color: #EA580C;">Connect</span></h1>
  </div>

  <p>${companyName} 様</p>

  <p>FoodOEM Connectは、飲食店と食品OEM工場をAIでマッチングするプラットフォームです。</p>
  <p>貴社のOEM工場としてのご登録をお待ちしております。</p>

  ${
    inviterMessage
      ? `
  <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;">担当者からのメッセージ</p>
    <p style="margin: 0;">${inviterMessage.slice(0, 500)}</p>
  </div>`
      : ""
  }

  <div style="background: #FFF7ED; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px; font-weight: bold; color: #C2410C;">ご登録のメリット</p>
    <ul style="margin: 0; padding-left: 20px; color: #374151;">
      <li>飲食店からの案件が自動で届く</li>
      <li>得意分野に合ったマッチング</li>
      <li>プラットフォーム利用料は無料</li>
    </ul>
  </div>

  <a href="${SITE_URL}/invite/${token}" style="display: inline-block; background: #EA580C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 8px;">
    招待を受けて登録する
  </a>

  <p style="margin-top: 16px; font-size: 13px; color: #6B7280;">
    この招待リンクは7日間有効です。
  </p>

  <p style="margin-top: 32px; font-size: 12px; color: #9CA3AF;">
    このメールはFoodOEM Connectから送信されています。
    <br>心当たりのない場合はこのメールを無視してください。
  </p>
</body>
</html>`,
  };
}
