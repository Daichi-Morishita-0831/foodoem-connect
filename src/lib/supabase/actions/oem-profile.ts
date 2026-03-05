"use server";

import { createClient } from "../server";

interface UpdateOemProfileInput {
  specialties: string[];
  certifications: string[];
  min_lot_size: number;
  max_lot_size: number;
  production_area: string;
  delivery_areas: string[];
  description: string;
}

/**
 * OEMプロフィールを更新
 */
export async function updateOemProfile(
  input: UpdateOemProfileInput
): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "認証が必要です" };

  const { error } = await supabase
    .from("oem_profiles")
    .update({
      specialties: input.specialties,
      certifications: input.certifications,
      min_lot_size: input.min_lot_size,
      max_lot_size: input.max_lot_size,
      production_area: input.production_area,
      delivery_areas: input.delivery_areas,
      description: input.description,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("updateOemProfile error:", error);
    return { error: "プロフィールの更新に失敗しました" };
  }

  return { success: true };
}
