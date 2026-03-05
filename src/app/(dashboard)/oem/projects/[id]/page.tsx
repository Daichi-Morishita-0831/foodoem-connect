import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getProject, getRecipeSpec } from "@/lib/supabase/queries/projects";
import { RecipeSpecView } from "@/components/spec/recipe-spec-view";
import { ProjectStatusBadge } from "@/components/project/project-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RecipeSpecInput } from "@/lib/schemas/recipe-spec";

export default async function OemProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, recipeSpec] = await Promise.all([
    getProject(id),
    getRecipeSpec(id),
  ]);

  if (!project) {
    redirect("/oem/dashboard");
  }

  // DB型 → RecipeSpecInput型への変換
  const specInput: RecipeSpecInput | null = recipeSpec
    ? {
        menu_name: recipeSpec.menu_name,
        menu_category: recipeSpec.menu_category,
        main_ingredients: recipeSpec.main_ingredients,
        seasoning_direction: recipeSpec.seasoning_direction,
        target_unit_cost: recipeSpec.target_unit_cost,
        target_selling_price: recipeSpec.target_selling_price,
        desired_lot_size: recipeSpec.desired_lot_size,
        delivery_frequency: recipeSpec.delivery_frequency,
        allergens: recipeSpec.allergens,
        process_steps: recipeSpec.process_steps,
        preservation_method: recipeSpec.preservation_method,
        shelf_life_days: recipeSpec.shelf_life_days,
        packaging_type: recipeSpec.packaging_type,
        required_certifications: recipeSpec.required_certifications,
        additional_requirements: null,
        confidence_score: recipeSpec.ai_confidence_score ?? 0,
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/oem/inquiries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
      </div>

      {specInput ? (
        <RecipeSpecView spec={specInput} />
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">レシピ仕様がまだ作成されていません</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
