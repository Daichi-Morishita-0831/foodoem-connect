const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://foodoem-connect.vercel.app";

interface InquiryResponseProps {
  restaurantName: string;
  oemCompanyName: string;
  projectTitle: string;
  status: "approved" | "rejected";
  projectId: string;
}

export function renderInquiryResponse(props: InquiryResponseProps) {
  const { restaurantName, oemCompanyName, projectTitle, status, projectId } =
    props;

  const isApproved = status === "approved";
  const statusLabel = isApproved ? "承認されました" : "辞退されました";

  return {
    subject: `【FoodOEM Connect】問い合わせが${statusLabel}`,
    html: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #374151;">
  <div style="border-bottom: 3px solid #EA580C; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 20px; color: #111827; margin: 0;">FoodOEM <span style="color: #EA580C;">Connect</span></h1>
  </div>

  <p>${restaurantName} 様</p>

  <p>「${projectTitle}」への問い合わせが<strong>${statusLabel}</strong>。</p>

  <div style="background: ${isApproved ? "#F0FDF4" : "#FEF2F2"}; border-radius: 8px; padding: 16px; margin: 16px 0;">
    <p style="margin: 0 0 8px; font-size: 14px; color: #6B7280;">工場名</p>
    <p style="margin: 0 0 8px; font-weight: bold;">${oemCompanyName}</p>
    <p style="margin: 0; font-size: 14px; color: ${isApproved ? "#16A34A" : "#DC2626"}; font-weight: bold;">
      ${isApproved ? "商談を開始できます。メッセージを送信してみましょう。" : "他の工場へ問い合わせをしてみましょう。"}
    </p>
  </div>

  <a href="${SITE_URL}/projects/${projectId}/matches" style="display: inline-block; background: #EA580C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
    詳細を確認する
  </a>

  <p style="margin-top: 32px; font-size: 12px; color: #9CA3AF;">
    このメールはFoodOEM Connectから自動送信されています。
  </p>
</body>
</html>`,
  };
}
