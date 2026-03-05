// プロジェクトステータスの日本語ラベル
export const projectStatusLabels: Record<string, string> = {
  draft: "下書き",
  submitted: "提出済み",
  matching: "マッチング中",
  negotiation: "商談中",
  contracted: "契約済み",
  production: "製造中",
  completed: "完了",
  cancelled: "キャンセル",
};

// ステータスの色
export const projectStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  matching: "bg-amber-100 text-amber-700",
  negotiation: "bg-purple-100 text-purple-700",
  contracted: "bg-green-100 text-green-700",
  production: "bg-cyan-100 text-cyan-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

// 問い合わせステータス
export const inquiryStatusLabels: Record<string, string> = {
  pending: "保留中",
  approved: "承認済み",
  rejected: "辞退",
};

export const inquiryStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

// 通知タイプ
export const notificationTypeLabels: Record<string, string> = {
  inquiry_received: "問い合わせ受信",
  inquiry_responded: "問い合わせ回答",
  new_message: "新着メッセージ",
  project_update: "案件更新",
};

// ロール
export const roleLabels: Record<string, string> = {
  restaurant: "飲食店",
  oem: "OEM工場",
  admin: "管理者",
};
