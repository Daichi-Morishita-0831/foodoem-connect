import type { Project, RecipeSpec } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "proj-001",
    restaurant_id: "user-rest-001",
    oem_id: null,
    title: "オリジナル肉じゃがの量産化",
    status: "matching",
    created_at: "2026-03-01T09:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "proj-002",
    restaurant_id: "user-rest-001",
    oem_id: null,
    title: "自家製デミグラスソースのOEM",
    status: "draft",
    created_at: "2026-02-28T14:00:00Z",
    updated_at: "2026-02-28T14:00:00Z",
  },
  {
    id: "proj-003",
    restaurant_id: "user-rest-002",
    oem_id: "user-oem-004",
    title: "オリジナルチーズケーキの委託製造",
    status: "negotiation",
    created_at: "2026-02-20T11:00:00Z",
    updated_at: "2026-03-03T16:00:00Z",
  },
];

export const mockRecipeSpecs: RecipeSpec[] = [
  {
    id: "spec-001",
    project_id: "proj-001",
    version: 1,
    raw_transcript:
      "うちの肉じゃがなんだけど、牛肉とじゃがいもがメインで、甘辛い醤油ベースの味付け。原価は1個あたり150円くらいに抑えたいんだよね。500個から作ってほしくて、冷蔵で5日くらいもってほしい。真空パックで。アレルギーは牛肉と大豆が入ってるかな。HACCPは取ってるところがいいな。",
    menu_name: "特製牛肉じゃが",
    menu_category: "side_dish",
    main_ingredients: [
      { name: "牛肉（バラ）", approximate_ratio: "約30%" },
      { name: "じゃがいも", approximate_ratio: "約25%" },
      { name: "玉ねぎ", approximate_ratio: "約15%" },
      { name: "人参", approximate_ratio: "約10%" },
      { name: "しらたき", approximate_ratio: "約10%" },
    ],
    seasoning_direction: "甘辛醤油ベース（みりん・砂糖・醤油）",
    target_unit_cost: 150,
    target_selling_price: 380,
    desired_lot_size: 500,
    delivery_frequency: "週1回",
    allergens: ["beef", "soy", "wheat"],
    process_steps: [
      { order: 1, description: "野菜の皮むき・カット", duration: "15分" },
      { order: 2, description: "牛肉を炒める", temperature: "中火", duration: "5分" },
      { order: 3, description: "野菜を加えて炒める", duration: "5分" },
      { order: 4, description: "調味料を加えて煮込む", temperature: "弱火", duration: "30分" },
      { order: 5, description: "粗熱を取り、真空パック", duration: "20分" },
    ],
    preservation_method: "refrigerated",
    shelf_life_days: 5,
    packaging_type: "真空パック",
    required_certifications: ["HACCP"],
    ai_confidence_score: 0.92,
    created_at: "2026-03-01T09:30:00Z",
    updated_at: "2026-03-01T09:30:00Z",
  },
];

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
