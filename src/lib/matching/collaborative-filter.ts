import { createClient } from "@/lib/supabase/server";

interface CollaborativeWeight {
  oemProfileId: string;
  bonus: number;
  reason: string;
}

/**
 * 協調フィルタリング: 過去の成約・レビューデータから重み調整値を計算
 * - 高評価レビューのあるOEMにはボーナス
 * - 同じカテゴリで成約実績のあるOEMにはボーナス
 * - 低評価が多いOEMにはペナルティ
 */
export async function getCollaborativeWeights(
  menuCategory: string
): Promise<CollaborativeWeight[]> {
  const supabase = await createClient();
  const weights: CollaborativeWeight[] = [];

  // 過去の成約プロジェクト＋レビューデータを取得
  const { data: completedProjects } = await supabase
    .from("projects")
    .select(
      `
      id,
      oem_id,
      recipe_specs!inner(menu_category)
    `
    )
    .eq("status", "completed")
    .not("oem_id", "is", null);

  if (!completedProjects) return weights;

  // OEMごとの成約数・カテゴリ別成約数を集計
  const oemStats = new Map<
    string,
    { total: number; categoryMatch: number }
  >();

  for (const project of completedProjects) {
    const oemId = project.oem_id!;
    const specs = project.recipe_specs as unknown as { menu_category: string }[];
    const hasCategory = specs.some((s) => s.menu_category === menuCategory);

    const stats = oemStats.get(oemId) || { total: 0, categoryMatch: 0 };
    stats.total++;
    if (hasCategory) stats.categoryMatch++;
    oemStats.set(oemId, stats);
  }

  // レビューデータ取得
  const { data: reviews } = await supabase
    .from("reviews")
    .select("reviewee_id, rating");

  const oemRatings = new Map<string, { sum: number; count: number }>();
  if (reviews) {
    for (const review of reviews) {
      const r = oemRatings.get(review.reviewee_id) || { sum: 0, count: 0 };
      r.sum += review.rating;
      r.count++;
      oemRatings.set(review.reviewee_id, r);
    }
  }

  // OEMプロフィールID取得（user_id → oem_profile_id マッピング）
  const oemUserIds = [
    ...new Set([...oemStats.keys(), ...oemRatings.keys()]),
  ];
  if (oemUserIds.length === 0) return weights;

  const { data: profiles } = await supabase
    .from("oem_profiles")
    .select("id, user_id")
    .in("user_id", oemUserIds);

  if (!profiles) return weights;

  const userToProfile = new Map(profiles.map((p) => [p.user_id, p.id]));

  // 重みを計算
  for (const [userId, stats] of oemStats) {
    const profileId = userToProfile.get(userId);
    if (!profileId) continue;

    // カテゴリ一致の成約実績ボーナス (+3〜+8)
    if (stats.categoryMatch > 0) {
      const bonus = Math.min(3 + stats.categoryMatch * 2, 8);
      weights.push({
        oemProfileId: profileId,
        bonus,
        reason: `同カテゴリの成約実績${stats.categoryMatch}件`,
      });
    }

    // 総成約数ボーナス (+1〜+5)
    if (stats.total >= 3) {
      const bonus = Math.min(Math.floor(stats.total / 2), 5);
      weights.push({
        oemProfileId: profileId,
        bonus,
        reason: `累計成約${stats.total}件の実績`,
      });
    }
  }

  // レビュー評価によるボーナス/ペナルティ
  for (const [userId, rating] of oemRatings) {
    const profileId = userToProfile.get(userId);
    if (!profileId) continue;

    const avg = rating.sum / rating.count;
    if (avg >= 4.5 && rating.count >= 3) {
      weights.push({
        oemProfileId: profileId,
        bonus: 5,
        reason: `高評価 (平均${avg.toFixed(1)}、${rating.count}件)`,
      });
    } else if (avg < 2.5 && rating.count >= 2) {
      weights.push({
        oemProfileId: profileId,
        bonus: -5,
        reason: `低評価 (平均${avg.toFixed(1)})`,
      });
    }
  }

  return weights;
}
