import { z } from "zod";

// アレルゲン特定原材料等28品目
export const allergenEnum = z.enum([
  "egg",
  "milk",
  "wheat",
  "shrimp",
  "crab",
  "buckwheat",
  "peanut",
  "almond",
  "abalone",
  "squid",
  "salmon_roe",
  "orange",
  "cashew",
  "kiwi",
  "beef",
  "walnut",
  "sesame",
  "salmon",
  "mackerel",
  "soy",
  "chicken",
  "banana",
  "pork",
  "matsutake",
  "peach",
  "yam",
  "apple",
  "gelatin",
]);

export const menuCategoryEnum = z.enum([
  "side_dish",
  "sauce",
  "soup",
  "dessert",
  "frozen_meal",
  "bento",
  "other",
]);

export const preservationMethodEnum = z.enum([
  "refrigerated",
  "frozen",
  "room_temperature",
]);

export const ingredientSchema = z.object({
  name: z.string().describe("食材名"),
  approximate_ratio: z.string().optional().describe("おおよその割合（例: 約30%）"),
});

export const processStepSchema = z.object({
  order: z.number().describe("工程番号"),
  description: z.string().describe("工程の説明"),
  temperature: z.string().optional().describe("温度（例: 180℃）"),
  duration: z.string().optional().describe("所要時間（例: 15分）"),
});

// GPT-4oに渡す構造化スキーマ（音声文字起こしテキストから抽出）
export const recipeSpecSchema = z.object({
  menu_name: z.string().describe("メニュー名"),
  menu_category: menuCategoryEnum.describe("メニューカテゴリ"),
  main_ingredients: z
    .array(ingredientSchema)
    .describe("メイン食材リスト"),
  seasoning_direction: z
    .string()
    .describe("味付けの方向性（例: 甘辛醤油ベース、塩麹風味）"),
  target_unit_cost: z
    .number()
    .nullable()
    .describe("ターゲット原価（円/個）"),
  target_selling_price: z
    .number()
    .nullable()
    .describe("想定販売価格（円/個）"),
  desired_lot_size: z
    .number()
    .nullable()
    .describe("希望ロット数（個）"),
  delivery_frequency: z
    .string()
    .nullable()
    .describe("希望配送頻度（例: 週2回、月1回）"),
  allergens: z
    .array(allergenEnum)
    .describe("含有アレルゲン特定原材料等28品目"),
  process_steps: z
    .array(processStepSchema)
    .describe("想定製造工程"),
  preservation_method: preservationMethodEnum.describe(
    "保存方法（冷蔵/冷凍/常温）"
  ),
  shelf_life_days: z
    .number()
    .nullable()
    .describe("希望賞味期限（日数）"),
  packaging_type: z
    .string()
    .nullable()
    .describe("希望包装形態（例: 真空パック、トレー）"),
  required_certifications: z
    .array(z.string())
    .describe("必要な認証（例: HACCP, ISO22000）"),
  additional_requirements: z
    .string()
    .nullable()
    .describe("その他の要望・補足事項"),
  confidence_score: z
    .number()
    .min(0)
    .max(1)
    .describe("AI構造化の信頼度スコア（0〜1）"),
});

export type RecipeSpecInput = z.infer<typeof recipeSpecSchema>;

// アレルゲン日本語名マッピング
export const allergenLabels: Record<string, string> = {
  egg: "卵",
  milk: "乳",
  wheat: "小麦",
  shrimp: "えび",
  crab: "かに",
  buckwheat: "そば",
  peanut: "落花生",
  almond: "アーモンド",
  abalone: "あわび",
  squid: "いか",
  salmon_roe: "いくら",
  orange: "オレンジ",
  cashew: "カシューナッツ",
  kiwi: "キウイフルーツ",
  beef: "牛肉",
  walnut: "くるみ",
  sesame: "ごま",
  salmon: "さけ",
  mackerel: "さば",
  soy: "大豆",
  chicken: "鶏肉",
  banana: "バナナ",
  pork: "豚肉",
  matsutake: "まつたけ",
  peach: "もも",
  yam: "やまいも",
  apple: "りんご",
  gelatin: "ゼラチン",
};

// メニューカテゴリ日本語名
export const menuCategoryLabels: Record<string, string> = {
  side_dish: "惣菜",
  sauce: "ソース・タレ",
  soup: "スープ",
  dessert: "スイーツ",
  frozen_meal: "冷凍食品",
  bento: "弁当",
  other: "その他",
};

// 保存方法日本語名
export const preservationMethodLabels: Record<string, string> = {
  refrigerated: "冷蔵",
  frozen: "冷凍",
  room_temperature: "常温",
};
