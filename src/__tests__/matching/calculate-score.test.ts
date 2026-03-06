import { describe, it, expect } from "vitest";
import { calculateMatchScore } from "@/lib/matching/calculate-score";
import type { RecipeSpec, OemProfile } from "@/types";

// テスト用ヘルパー
function createSpec(overrides: Partial<RecipeSpec> = {}): RecipeSpec {
  return {
    id: "spec-1",
    project_id: "proj-1",
    version: 1,
    raw_transcript: null,
    menu_name: "テスト惣菜",
    menu_category: "side_dish",
    main_ingredients: [{ name: "じゃがいも", approximate_ratio: "40%" }],
    seasoning_direction: "和風だし",
    target_unit_cost: null,
    target_selling_price: null,
    desired_lot_size: null,
    delivery_frequency: null,
    allergens: [],
    process_steps: [{ order: 1, description: "材料を切る" }],
    preservation_method: "refrigerated",
    shelf_life_days: null,
    packaging_type: null,
    required_certifications: [],
    ai_confidence_score: 0.8,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    ...overrides,
  };
}

function createProfile(overrides: Partial<OemProfile> = {}): OemProfile {
  return {
    id: "oem-1",
    user_id: "user-1",
    specialties: ["惣菜", "煮物"],
    certifications: ["HACCP", "ISO22000"],
    min_lot_size: 100,
    max_lot_size: 10000,
    production_area: "東京都",
    delivery_areas: ["東京都", "神奈川県"],
    facility_photos: [],
    description: "テストOEM",
    is_active: true,
    ...overrides,
  };
}

describe("calculateMatchScore", () => {
  describe("得意分野スコア（30点満点）", () => {
    it("得意分野が完全一致する場合30点", () => {
      const spec = createSpec({ menu_category: "side_dish" });
      const profile = createProfile({ specialties: ["惣菜", "煮物"] });
      const { score, reasons } = calculateMatchScore(spec, profile);

      const specialtyReason = reasons.find((r) => r.category === "得意分野");
      expect(specialtyReason?.is_match).toBe(true);
      expect(score).toBeGreaterThanOrEqual(30);
    });

    it("汎用キーワード（惣菜・食品）で部分一致の場合15点", () => {
      const spec = createSpec({ menu_category: "dessert" });
      const profile = createProfile({ specialties: ["惣菜"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const specialtyReason = reasons.find((r) => r.category === "得意分野");
      expect(specialtyReason?.is_match).toBe(true);
      expect(specialtyReason?.description).toContain("直接の専門分野ではない");
    });

    it("得意分野が全く異なる場合0点", () => {
      const spec = createSpec({ menu_category: "dessert" });
      const profile = createProfile({ specialties: ["精肉加工"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const specialtyReason = reasons.find((r) => r.category === "得意分野");
      expect(specialtyReason?.is_match).toBe(false);
    });

    it("ソースカテゴリのキーワードマッチ", () => {
      const spec = createSpec({ menu_category: "sauce" });
      const profile = createProfile({ specialties: ["ソース", "調味料"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const specialtyReason = reasons.find((r) => r.category === "得意分野");
      expect(specialtyReason?.is_match).toBe(true);
    });
  });

  describe("認証スコア（25点満点）", () => {
    it("認証要件なしの場合25点", () => {
      const spec = createSpec({ required_certifications: [] });
      const profile = createProfile();
      const { reasons } = calculateMatchScore(spec, profile);

      const certReason = reasons.find((r) => r.category === "認証");
      expect(certReason?.is_match).toBe(true);
      expect(certReason?.description).toContain("認証要件なし");
    });

    it("認証が全て一致する場合25点", () => {
      const spec = createSpec({ required_certifications: ["HACCP"] });
      const profile = createProfile({ certifications: ["HACCP", "ISO22000"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const certReason = reasons.find((r) => r.category === "認証");
      expect(certReason?.is_match).toBe(true);
    });

    it("認証が部分一致する場合比率で計算", () => {
      const spec = createSpec({
        required_certifications: ["HACCP", "有機JAS"],
      });
      const profile = createProfile({ certifications: ["HACCP"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const certReason = reasons.find((r) => r.category === "認証");
      expect(certReason?.is_match).toBe(true);
      expect(certReason?.description).toContain("一部未取得");
    });

    it("認証が全く一致しない場合0点", () => {
      const spec = createSpec({ required_certifications: ["有機JAS"] });
      const profile = createProfile({ certifications: ["HACCP"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const certReason = reasons.find((r) => r.category === "認証");
      expect(certReason?.is_match).toBe(false);
    });

    it("認証の大文字小文字を無視して比較", () => {
      const spec = createSpec({ required_certifications: ["haccp"] });
      const profile = createProfile({ certifications: ["HACCP"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const certReason = reasons.find((r) => r.category === "認証");
      expect(certReason?.is_match).toBe(true);
    });
  });

  describe("ロットスコア（25点満点）", () => {
    it("ロット要件なしの場合25点", () => {
      const spec = createSpec({ desired_lot_size: null });
      const profile = createProfile({ min_lot_size: 100, max_lot_size: 10000 });
      const { reasons } = calculateMatchScore(spec, profile);

      const lotReason = reasons.find((r) => r.category === "ロット");
      expect(lotReason?.is_match).toBe(true);
    });

    it("希望ロットが範囲内の場合25点", () => {
      const spec = createSpec({ desired_lot_size: 500 });
      const profile = createProfile({ min_lot_size: 100, max_lot_size: 10000 });
      const { reasons } = calculateMatchScore(spec, profile);

      const lotReason = reasons.find((r) => r.category === "ロット");
      expect(lotReason?.is_match).toBe(true);
      expect(lotReason?.description).toContain("対応可能");
    });

    it("希望ロットが最小ロットの半分以上の場合10点", () => {
      const spec = createSpec({ desired_lot_size: 60 });
      const profile = createProfile({ min_lot_size: 100, max_lot_size: 10000 });
      const { reasons } = calculateMatchScore(spec, profile);

      const lotReason = reasons.find((r) => r.category === "ロット");
      expect(lotReason?.is_match).toBe(false);
      expect(lotReason?.description).toContain("要相談");
    });

    it("希望ロットが最小ロットの半分未満の場合0点", () => {
      const spec = createSpec({ desired_lot_size: 10 });
      const profile = createProfile({ min_lot_size: 100, max_lot_size: 10000 });
      const { reasons } = calculateMatchScore(spec, profile);

      const lotReason = reasons.find((r) => r.category === "ロット");
      expect(lotReason?.is_match).toBe(false);
      expect(lotReason?.description).toContain("対応困難");
    });

    it("希望ロットが最大を超える場合10点（分割対応）", () => {
      const spec = createSpec({ desired_lot_size: 20000 });
      const profile = createProfile({ min_lot_size: 100, max_lot_size: 10000 });
      const { reasons } = calculateMatchScore(spec, profile);

      const lotReason = reasons.find((r) => r.category === "ロット");
      expect(lotReason?.is_match).toBe(false);
      expect(lotReason?.description).toContain("分割対応");
    });
  });

  describe("配送エリアスコア（20点満点）", () => {
    it("東京を含む配送エリアの場合20点", () => {
      const spec = createSpec();
      const profile = createProfile({ delivery_areas: ["東京都", "千葉県"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const deliveryReason = reasons.find((r) => r.category === "配送");
      expect(deliveryReason?.is_match).toBe(true);
    });

    it("全国配送の場合20点", () => {
      const spec = createSpec();
      const profile = createProfile({ delivery_areas: ["全国"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const deliveryReason = reasons.find((r) => r.category === "配送");
      expect(deliveryReason?.is_match).toBe(true);
    });

    it("関東配送の場合20点", () => {
      const spec = createSpec();
      const profile = createProfile({ delivery_areas: ["関東"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const deliveryReason = reasons.find((r) => r.category === "配送");
      expect(deliveryReason?.is_match).toBe(true);
    });

    it("東京以外のエリアのみの場合5点", () => {
      const spec = createSpec();
      const profile = createProfile({ delivery_areas: ["大阪府", "京都府"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const deliveryReason = reasons.find((r) => r.category === "配送");
      expect(deliveryReason?.is_match).toBe(false);
    });
  });

  describe("ボーナススコア", () => {
    it("保存方法が互換性ある場合+5点", () => {
      const spec = createSpec({ preservation_method: "frozen" });
      const profile = createProfile({ specialties: ["冷凍食品"] });
      const { reasons } = calculateMatchScore(spec, profile);

      const preserveReason = reasons.find((r) => r.category === "保存方法");
      expect(preserveReason?.is_match).toBe(true);
    });

    it("高評価OEMの場合+3点", () => {
      const spec = createSpec();
      const profile = createProfile();
      const { reasons } = calculateMatchScore(spec, profile, {
        oemAverageRating: 4.5,
      });

      const ratingReason = reasons.find((r) => r.category === "評価");
      expect(ratingReason?.is_match).toBe(true);
    });

    it("低評価OEMの場合-5点", () => {
      const spec = createSpec();
      const profile = createProfile();
      const { reasons } = calculateMatchScore(spec, profile, {
        oemAverageRating: 2.0,
      });

      const ratingReason = reasons.find((r) => r.category === "評価");
      expect(ratingReason?.is_match).toBe(false);
    });
  });

  describe("総合スコア", () => {
    it("完全マッチの場合100点（上限）", () => {
      const spec = createSpec({
        menu_category: "side_dish",
        required_certifications: [],
        desired_lot_size: 500,
        preservation_method: "refrigerated",
      });
      const profile = createProfile({
        specialties: ["惣菜", "煮物"],
        certifications: ["HACCP"],
        min_lot_size: 100,
        max_lot_size: 10000,
        delivery_areas: ["東京都"],
      });
      const { score } = calculateMatchScore(spec, profile, {
        oemAverageRating: 4.5,
      });

      expect(score).toBe(100);
    });

    it("最低マッチの場合0点以上を保証", () => {
      const spec = createSpec({
        menu_category: "dessert",
        required_certifications: ["有機JAS", "FSSC22000"],
        desired_lot_size: 5,
      });
      const profile = createProfile({
        specialties: ["精肉加工"],
        certifications: [],
        min_lot_size: 1000,
        max_lot_size: 50000,
        delivery_areas: ["北海道"],
      });
      const { score } = calculateMatchScore(spec, profile, {
        oemAverageRating: 1.0,
      });

      expect(score).toBeGreaterThanOrEqual(0);
    });

    it("スコアが0〜100の範囲内であること", () => {
      const spec = createSpec();
      const profile = createProfile();
      const { score } = calculateMatchScore(spec, profile);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
