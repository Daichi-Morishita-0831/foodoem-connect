import Anthropic from "@anthropic-ai/sdk";
import type { RecipeSpec } from "@/types";

const anthropic = new Anthropic();

export interface CostEstimate {
  estimatedUnitCost: { min: number; max: number };
  breakdown: CostBreakdownItem[];
  notes: string;
}

export interface CostBreakdownItem {
  item: string;
  ratio: string;
  estimatedCost: string;
}

/**
 * レシピスペックからAIによる原価概算を生成
 */
export async function estimateRecipeCost(
  spec: RecipeSpec
): Promise<CostEstimate> {
  const specSummary = {
    menu_name: spec.menu_name,
    menu_category: spec.menu_category,
    main_ingredients: spec.main_ingredients,
    seasoning_direction: spec.seasoning_direction,
    desired_lot_size: spec.desired_lot_size,
    preservation_method: spec.preservation_method,
    packaging_type: spec.packaging_type,
    process_steps: spec.process_steps,
  };

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: `あなたは食品OEM製造のコスト見積もり専門家です。レシピ仕様から1個あたりの概算製造原価を推定してください。
回答は以下のJSON形式で返してください:
{
  "estimatedUnitCost": {"min": 最小円, "max": 最大円},
  "breakdown": [{"item": "項目名", "ratio": "構成比%", "estimatedCost": "推定金額"}],
  "notes": "注意事項（1〜2文）"
}
日本の食品製造原価の相場をもとに推定してください。あくまで概算であることを注記に含めてください。`,
    messages: [
      {
        role: "user",
        content: `以下のレシピ仕様の製造原価を概算してください:\n\n${JSON.stringify(specSummary, null, 2)}`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    return {
      estimatedUnitCost: { min: 0, max: 0 },
      breakdown: [],
      notes: "原価推定に失敗しました",
    };
  }

  try {
    const jsonMatch = block.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]) as CostEstimate;
  } catch {
    return {
      estimatedUnitCost: { min: 0, max: 0 },
      breakdown: [],
      notes: "原価推定の解析に失敗しました",
    };
  }
}
