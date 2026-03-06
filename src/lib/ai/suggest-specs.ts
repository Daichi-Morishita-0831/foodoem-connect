import Anthropic from "@anthropic-ai/sdk";
import type { RecipeSpec } from "@/types";

const anthropic = new Anthropic();

export interface SpecSuggestion {
  field: string;
  fieldLabel: string;
  suggestion: string;
  reason: string;
}

/**
 * レシピスペックの不足項目を分析し、追加質問を生成
 */
export async function suggestMissingSpecs(
  spec: RecipeSpec
): Promise<SpecSuggestion[]> {
  const specSummary = JSON.stringify(
    {
      menu_name: spec.menu_name,
      menu_category: spec.menu_category,
      main_ingredients: spec.main_ingredients,
      seasoning_direction: spec.seasoning_direction,
      target_unit_cost: spec.target_unit_cost,
      target_selling_price: spec.target_selling_price,
      desired_lot_size: spec.desired_lot_size,
      delivery_frequency: spec.delivery_frequency,
      allergens: spec.allergens,
      preservation_method: spec.preservation_method,
      shelf_life_days: spec.shelf_life_days,
      packaging_type: spec.packaging_type,
      required_certifications: spec.required_certifications,
      process_steps: spec.process_steps,
      ai_confidence_score: spec.ai_confidence_score,
    },
    null,
    2
  );

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 800,
    system: `あなたは食品OEM製造の専門家です。レシピスペックを分析し、マッチング精度を上げるために不足している情報や追加すべき仕様を提案してください。
回答はJSON配列形式で返してください。各要素は:
{"field":"フィールド名","fieldLabel":"日本語ラベル","suggestion":"具体的な提案","reason":"なぜこの情報が重要か"}
最大5個まで。NULLや空の項目を優先的に提案してください。`,
    messages: [
      {
        role: "user",
        content: `以下のレシピスペックを分析して、不足している仕様を提案してください:\n\n${specSummary}`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") return [];

  try {
    const jsonMatch = block.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as SpecSuggestion[];
  } catch {
    return [];
  }
}
