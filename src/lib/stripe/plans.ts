export interface Plan {
  id: "free" | "premium" | "enterprise";
  name: string;
  description: string;
  price: number; // 月額 (JPY)
  features: string[];
  stripePriceId: string | null;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "フリー",
    description: "まずは無料でお試し",
    price: 0,
    features: [
      "月3件までの案件登録",
      "AIマッチング基本機能",
      "メッセージ機能",
    ],
    stripePriceId: null,
  },
  {
    id: "premium",
    name: "プレミアム",
    description: "成長する飲食店に最適",
    price: 9800,
    features: [
      "案件登録無制限",
      "AIマッチング優先表示",
      "メッセージ機能",
      "レビュー機能",
      "優先サポート",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "",
  },
  {
    id: "enterprise",
    name: "エンタープライズ",
    description: "大規模チェーン向け",
    price: 29800,
    features: [
      "全プレミアム機能",
      "専任担当者",
      "カスタムマッチング",
      "APIアクセス",
      "SLA保証",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "",
  },
];

export function getPlanById(planId: string): Plan | undefined {
  return plans.find((p) => p.id === planId);
}

export function getPlanByPriceId(priceId: string): Plan | undefined {
  return plans.find((p) => p.stripePriceId === priceId);
}
