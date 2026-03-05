import Anthropic from "@anthropic-ai/sdk";
import type { RecipeSpecInput } from "@/lib/schemas/recipe-spec";

const client = new Anthropic();

const SYSTEM_PROMPT = `あなたは食品OEM業界に精通したAIアシスタントです。
飲食店オーナーの音声テキスト（カジュアルな日本語）を受け取り、
OEM工場が理解できる構造化されたレシピ仕様書に変換してください。

以下のルールに従ってください：
1. 曖昧な表現は食品業界の標準的な解釈で補完する
2. アレルゲンは特定原材料等28品目から該当するものを全て列挙する
3. 製造工程は工場の製造ラインを意識した粒度で記述する
4. 情報が不足している場合はnullにし、推測で埋めない
5. confidence_scoreは情報の充実度に基づいて0〜1で算出する

出力はJSON形式のみ。説明文は不要。`;

const OUTPUT_SCHEMA = `{
  "menu_name": "string - メニュー名",
  "menu_category": "side_dish|sauce|soup|dessert|frozen_meal|bento|other",
  "main_ingredients": [{"name": "string", "approximate_ratio": "string|null"}],
  "seasoning_direction": "string - 味付けの方向性",
  "target_unit_cost": "number|null - 円/個",
  "target_selling_price": "number|null - 円/個",
  "desired_lot_size": "number|null",
  "delivery_frequency": "string|null",
  "allergens": ["egg|milk|wheat|shrimp|crab|buckwheat|peanut|almond|abalone|squid|salmon_roe|orange|cashew|kiwi|beef|walnut|sesame|salmon|mackerel|soy|chicken|banana|pork|matsutake|peach|yam|apple|gelatin"],
  "process_steps": [{"order": "number", "description": "string", "temperature": "string|null", "duration": "string|null"}],
  "preservation_method": "refrigerated|frozen|room_temperature",
  "shelf_life_days": "number|null",
  "packaging_type": "string|null",
  "required_certifications": ["string"],
  "additional_requirements": "string|null",
  "confidence_score": "number 0-1"
}`;

export async function structurizeRecipeFromText(
  transcript: string
): Promise<RecipeSpecInput> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `以下の音声テキストを構造化してください。

【音声テキスト】
${transcript}

【出力スキーマ】
${OUTPUT_SCHEMA}

JSON形式で出力:`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude APIからテキスト応答を取得できませんでした");
  }

  // JSONを抽出（コードブロックに包まれている場合にも対応）
  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  return JSON.parse(jsonStr) as RecipeSpecInput;
}
