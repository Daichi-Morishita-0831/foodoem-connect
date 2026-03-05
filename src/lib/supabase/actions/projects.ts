"use server";

import { createClient } from "../server";
import type { RecipeSpec } from "@/types";

interface CreateProjectInput {
  title: string;
  spec: Omit<
    RecipeSpec,
    "id" | "project_id" | "version" | "created_at" | "updated_at"
  >;
}

/**
 * 新規案件 + レシピ仕様書を作成
 */
export async function createProject(
  input: CreateProjectInput
): Promise<{ projectId: string } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // プロジェクト作成
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      restaurant_id: user.id,
      title: input.title,
      status: "draft",
    })
    .select()
    .single();

  if (projectError || !project) {
    console.error("createProject error:", projectError);
    return { error: "プロジェクト作成に失敗しました" };
  }

  // レシピ仕様書作成
  const { error: specError } = await supabase.from("recipe_specs").insert({
    project_id: project.id,
    version: 1,
    raw_transcript: input.spec.raw_transcript,
    menu_name: input.spec.menu_name,
    menu_category: input.spec.menu_category,
    main_ingredients: input.spec.main_ingredients,
    seasoning_direction: input.spec.seasoning_direction,
    target_unit_cost: input.spec.target_unit_cost,
    target_selling_price: input.spec.target_selling_price,
    desired_lot_size: input.spec.desired_lot_size,
    delivery_frequency: input.spec.delivery_frequency,
    allergens: input.spec.allergens,
    process_steps: input.spec.process_steps,
    preservation_method: input.spec.preservation_method,
    shelf_life_days: input.spec.shelf_life_days,
    packaging_type: input.spec.packaging_type,
    required_certifications: input.spec.required_certifications,
    ai_confidence_score: input.spec.ai_confidence_score,
  });

  if (specError) {
    console.error("createRecipeSpec error:", specError);
    return { error: "レシピ仕様書作成に失敗しました" };
  }

  return { projectId: project.id };
}
