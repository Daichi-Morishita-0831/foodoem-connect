import type { RecipeSpec, OemProfile, MatchReason } from "@/types";

interface ScoreResult {
  score: number;
  reasons: MatchReason[];
}

/**
 * マッチングスコアを計算（100点満点）
 * - 得意分野: 30点
 * - 認証: 25点
 * - ロット: 25点
 * - 配送エリア: 20点
 */
export function calculateMatchScore(
  spec: RecipeSpec,
  profile: OemProfile
): ScoreResult {
  const reasons: MatchReason[] = [];
  let totalScore = 0;

  // --- 得意分野 (30点) ---
  const categoryKeywords = getCategoryKeywords(spec.menu_category);
  const specialtyMatch = profile.specialties.some((s) =>
    categoryKeywords.some((kw) => s.includes(kw))
  );

  if (specialtyMatch) {
    totalScore += 30;
    const matchedSpecialties = profile.specialties.filter((s) =>
      categoryKeywords.some((kw) => s.includes(kw))
    );
    reasons.push({
      category: "得意分野",
      description: `${matchedSpecialties.join("・")}の製造実績あり`,
      is_match: true,
    });
  } else {
    // 部分一致（惣菜・食品などの汎用キーワード）
    const genericMatch = profile.specialties.some(
      (s) => s.includes("惣菜") || s.includes("食品")
    );
    if (genericMatch) {
      totalScore += 15;
      reasons.push({
        category: "得意分野",
        description: `惣菜製造の実績あり（直接の専門分野ではない）`,
        is_match: true,
      });
    } else {
      reasons.push({
        category: "得意分野",
        description: `専門分野が異なる（${profile.specialties.join("・")}が専門）`,
        is_match: false,
      });
    }
  }

  // --- 認証 (25点) ---
  const requiredCerts = spec.required_certifications;
  if (requiredCerts.length === 0) {
    totalScore += 25;
    reasons.push({
      category: "認証",
      description: "特定の認証要件なし",
      is_match: true,
    });
  } else {
    const matchedCerts = requiredCerts.filter((cert) =>
      profile.certifications.some(
        (pc) => pc.toUpperCase() === cert.toUpperCase()
      )
    );
    const certRatio = matchedCerts.length / requiredCerts.length;
    totalScore += Math.round(25 * certRatio);

    if (certRatio === 1) {
      reasons.push({
        category: "認証",
        description: `${matchedCerts.join("・")}取得済み`,
        is_match: true,
      });
    } else if (certRatio > 0) {
      reasons.push({
        category: "認証",
        description: `${matchedCerts.join("・")}取得済み（一部未取得あり）`,
        is_match: true,
      });
    } else {
      reasons.push({
        category: "認証",
        description: `要求認証（${requiredCerts.join("・")}）が未取得`,
        is_match: false,
      });
    }
  }

  // --- ロット (25点) ---
  const desiredLot = spec.desired_lot_size;
  if (!desiredLot) {
    totalScore += 25;
    reasons.push({
      category: "ロット",
      description: "ロット要件なし",
      is_match: true,
    });
  } else if (
    desiredLot >= profile.min_lot_size &&
    desiredLot <= profile.max_lot_size
  ) {
    totalScore += 25;
    reasons.push({
      category: "ロット",
      description: `希望ロット${desiredLot.toLocaleString()}個に対応可能（${profile.min_lot_size.toLocaleString()}〜${profile.max_lot_size.toLocaleString()}個）`,
      is_match: true,
    });
  } else if (desiredLot < profile.min_lot_size) {
    // 最小ロットの2倍以内なら一部対応可能
    if (desiredLot >= profile.min_lot_size / 2) {
      totalScore += 10;
      reasons.push({
        category: "ロット",
        description: `最小ロット${profile.min_lot_size.toLocaleString()}個のため要相談`,
        is_match: false,
      });
    } else {
      reasons.push({
        category: "ロット",
        description: `最小ロット${profile.min_lot_size.toLocaleString()}個のため対応困難`,
        is_match: false,
      });
    }
  } else {
    totalScore += 10;
    reasons.push({
      category: "ロット",
      description: `最大ロット${profile.max_lot_size.toLocaleString()}個のため分割対応が必要`,
      is_match: false,
    });
  }

  // --- 配送エリア (20点) ---
  // 簡易判定: 東京都を含む配送エリアならマッチ
  const hasTokyoDelivery = profile.delivery_areas.some(
    (area) =>
      area.includes("東京") || area.includes("関東") || area.includes("全国")
  );
  if (hasTokyoDelivery) {
    totalScore += 20;
    reasons.push({
      category: "配送",
      description: `${profile.delivery_areas.join("・")}への配送対応`,
      is_match: true,
    });
  } else {
    totalScore += 5;
    reasons.push({
      category: "配送",
      description: `配送エリアは${profile.delivery_areas.join("・")}（要確認）`,
      is_match: false,
    });
  }

  return {
    score: Math.min(100, totalScore),
    reasons,
  };
}

function getCategoryKeywords(category: string): string[] {
  const mapping: Record<string, string[]> = {
    side_dish: ["惣菜", "煮物", "和食", "おかず"],
    sauce: ["ソース", "タレ", "ドレッシング", "調味料"],
    soup: ["スープ", "汁物", "だし"],
    dessert: ["スイーツ", "デザート", "菓子", "洋菓子"],
    frozen_meal: ["冷凍", "冷凍食品"],
    bento: ["弁当", "惣菜", "サラダ"],
    other: ["食品"],
  };
  return mapping[category] ?? ["食品"];
}
