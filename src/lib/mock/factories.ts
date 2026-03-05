import type { OemProfile, MatchResult, MatchReason } from "@/types";

// モック工場データ（5社）
export const mockOemProfiles: OemProfile[] = [
  {
    id: "oem-001",
    user_id: "user-oem-001",
    specialties: ["惣菜", "煮物", "和食"],
    certifications: ["HACCP", "ISO22000"],
    min_lot_size: 500,
    max_lot_size: 50000,
    production_area: "埼玉県川口市",
    delivery_areas: ["東京都", "埼玉県", "千葉県", "神奈川県"],
    facility_photos: ["/images/factory-placeholder-1.jpg"],
    description:
      "創業40年の惣菜製造工場。和食を中心に、煮物・焼き物・揚げ物まで幅広く対応。HACCP認証取得済みで、大手コンビニチェーンへの納品実績あり。",
    is_active: true,
  },
  {
    id: "oem-002",
    user_id: "user-oem-002",
    specialties: ["ソース", "タレ", "ドレッシング"],
    certifications: ["HACCP", "有機JAS"],
    min_lot_size: 200,
    max_lot_size: 20000,
    production_area: "千葉県船橋市",
    delivery_areas: ["東京都", "千葉県", "埼玉県"],
    facility_photos: ["/images/factory-placeholder-2.jpg"],
    description:
      "液体調味料専門の製造工場。オリジナルソース・タレの開発から量産まで一貫対応。有機JAS認証取得で、ナチュラル志向の商品開発に強み。",
    is_active: true,
  },
  {
    id: "oem-003",
    user_id: "user-oem-003",
    specialties: ["冷凍食品", "餃子", "中華"],
    certifications: ["HACCP", "FSSC22000"],
    min_lot_size: 1000,
    max_lot_size: 100000,
    production_area: "群馬県太田市",
    delivery_areas: ["関東全域", "東北", "中部"],
    facility_photos: ["/images/factory-placeholder-3.jpg"],
    description:
      "冷凍食品に特化した大規模製造工場。急速冷凍ラインを3本保有し、餃子・焼売・春巻きなど中華系冷凍食品のOEMで豊富な実績。",
    is_active: true,
  },
  {
    id: "oem-004",
    user_id: "user-oem-004",
    specialties: ["スイーツ", "焼き菓子", "洋菓子"],
    certifications: ["HACCP"],
    min_lot_size: 100,
    max_lot_size: 10000,
    production_area: "東京都大田区",
    delivery_areas: ["東京都", "神奈川県"],
    facility_photos: ["/images/factory-placeholder-4.jpg"],
    description:
      "パティシエ出身の工場長が率いるスイーツ専門OEM。小ロットから対応可能で、飲食店オリジナルのデザート開発が得意。",
    is_active: true,
  },
  {
    id: "oem-005",
    user_id: "user-oem-005",
    specialties: ["弁当", "惣菜", "サラダ"],
    certifications: ["HACCP", "ISO22000", "ハラール"],
    min_lot_size: 300,
    max_lot_size: 30000,
    production_area: "神奈川県相模原市",
    delivery_areas: ["東京都", "神奈川県", "千葉県", "埼玉県"],
    facility_photos: ["/images/factory-placeholder-5.jpg"],
    description:
      "弁当・惣菜の受託製造を手がける総合食品工場。ハラール認証取得で、インバウンド需要にも対応。サラダ・カット野菜のラインも保有。",
    is_active: true,
  },
];

// モックマッチング結果
export const mockMatchResults: MatchResult[] = [
  {
    id: "match-001",
    project_id: "proj-001",
    oem_profile_id: "oem-001",
    match_score: 93,
    match_reasons: [
      { category: "得意分野", description: "惣菜・和食の製造実績が豊富", is_match: true },
      { category: "認証", description: "HACCP取得済み", is_match: true },
      { category: "ロット", description: "希望ロット500個に対応可能（最小500〜）", is_match: true },
      { category: "配送", description: "東京都内への配送対応", is_match: true },
    ],
    is_revealed: false,
    revealed_at: null,
    created_at: "2026-03-01T10:00:00Z",
    oem_profile: mockOemProfiles[0],
  },
  {
    id: "match-002",
    project_id: "proj-001",
    oem_profile_id: "oem-005",
    match_score: 85,
    match_reasons: [
      { category: "得意分野", description: "惣菜製造の実績あり", is_match: true },
      { category: "認証", description: "HACCP・ISO22000取得済み", is_match: true },
      { category: "ロット", description: "希望ロットに対応可能（最小300〜）", is_match: true },
      { category: "エリア", description: "神奈川拠点のため配送にやや時間", is_match: false },
    ],
    is_revealed: false,
    revealed_at: null,
    created_at: "2026-03-01T10:00:00Z",
    oem_profile: mockOemProfiles[4],
  },
  {
    id: "match-003",
    project_id: "proj-001",
    oem_profile_id: "oem-003",
    match_score: 72,
    match_reasons: [
      { category: "得意分野", description: "冷凍食品がメインだが惣菜対応も可", is_match: true },
      { category: "認証", description: "FSSC22000（上位認証）取得済み", is_match: true },
      { category: "ロット", description: "最小ロット1000個のため要相談", is_match: false },
      { category: "配送", description: "関東全域対応", is_match: true },
    ],
    is_revealed: false,
    revealed_at: null,
    created_at: "2026-03-01T10:00:00Z",
    oem_profile: mockOemProfiles[2],
  },
];
