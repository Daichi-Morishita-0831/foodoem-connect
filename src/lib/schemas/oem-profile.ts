import { z } from "zod";

export const oemProfileSchema = z.object({
  specialties: z.array(z.string()).min(1, "得意分野を1つ以上設定してください"),
  certifications: z.array(z.string()),
  min_lot_size: z.number().positive("最小ロット数は正の数で設定してください"),
  max_lot_size: z.number().positive("最大ロット数は正の数で設定してください"),
  production_area: z.string().min(1, "製造拠点を入力してください"),
  delivery_areas: z.array(z.string()).min(1, "配送エリアを1つ以上設定してください"),
  description: z.string().min(10, "工場紹介を10文字以上で入力してください"),
});

export type OemProfileFormData = z.infer<typeof oemProfileSchema>;

// 選択肢定義
export const specialtyOptions = [
  "惣菜",
  "ソース・たれ",
  "スープ",
  "デザート・菓子",
  "冷凍食品",
  "弁当・サラダ",
  "漬物・佃煮",
  "パン・麺",
  "ドレッシング",
  "レトルト食品",
  "乾燥食品",
  "飲料",
];

export const certificationOptions = [
  "HACCP",
  "FSSC22000",
  "ISO22000",
  "有機JAS",
  "ハラール",
  "コーシャ",
  "グルテンフリー認証",
  "SDGs対応",
];

export const deliveryAreaOptions = [
  "東京都",
  "神奈川県",
  "千葉県",
  "埼玉県",
  "茨城県",
  "栃木県",
  "群馬県",
  "関東全域",
  "全国対応",
];
