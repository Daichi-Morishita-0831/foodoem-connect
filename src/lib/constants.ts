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
