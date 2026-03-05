import { createClient } from "../server";
import type { OemProfile, Review } from "@/types";

export interface PublicOemData {
  profile: OemProfile;
  companyName: string;
  averageRating: number;
  reviewCount: number;
}

/**
 * 公開OEMプロフィール取得（認証不要）
 */
export async function getPublicOemProfile(
  oemProfileId: string
): Promise<PublicOemData | null> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("oem_profiles")
    .select("*")
    .eq("id", oemProfileId)
    .single();

  if (!profile) return null;

  const { data: user } = await supabase
    .from("users")
    .select("company_name")
    .eq("id", profile.user_id)
    .single();

  // 平均評価
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", profile.user_id);

  const ratings = reviews?.map((r) => r.rating) ?? [];
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

  return {
    profile: profile as OemProfile,
    companyName: user?.company_name ?? "未設定",
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: ratings.length,
  };
}

/**
 * OEMのレビュー一覧取得
 */
export async function getPublicOemReviews(
  oemUserId: string
): Promise<(Review & { reviewerCompanyName: string })[]> {
  const supabase = await createClient();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, reviewer:users!reviewer_id(company_name)")
    .eq("reviewee_id", oemUserId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!reviews) return [];

  return reviews.map((r) => ({
    ...(r as unknown as Review),
    reviewerCompanyName:
      (r.reviewer as unknown as { company_name: string })?.company_name ??
      "匿名",
  }));
}
