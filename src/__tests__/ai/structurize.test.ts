import { describe, it, expect, vi } from "vitest";

const mockCreate = vi.fn().mockResolvedValue({
  content: [
    {
      type: "text",
      text: JSON.stringify({
        menu_name: "特製ポテトサラダ",
        menu_category: "side_dish",
        main_ingredients: [
          { name: "じゃがいも", approximate_ratio: "50%" },
          { name: "マヨネーズ", approximate_ratio: "15%" },
        ],
        seasoning_direction: "マヨネーズベースの洋風",
        target_unit_cost: 80,
        target_selling_price: 200,
        desired_lot_size: 500,
        delivery_frequency: "週2回",
        allergens: ["egg", "soy"],
        process_steps: [
          {
            order: 1,
            description: "じゃがいもを茹でる",
            temperature: "100℃",
            duration: "15分",
          },
          {
            order: 2,
            description: "マッシュして調味料と混ぜる",
          },
        ],
        preservation_method: "refrigerated",
        shelf_life_days: 5,
        packaging_type: "プラスチック容器",
        required_certifications: ["HACCP"],
        additional_requirements: null,
        confidence_score: 0.85,
      }),
    },
  ],
});

// Anthropic SDKをクラスとしてモック
vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockCreate };
    },
  };
});

describe("structurizeRecipeFromText", () => {
  it("音声テキストを構造化レシピに変換する", async () => {
    const { structurizeRecipeFromText } = await import(
      "@/lib/ai/structurize"
    );

    const result = await structurizeRecipeFromText(
      "ポテトサラダを作りたいんですけど、じゃがいもメインで、マヨネーズ味で。500個くらいのロットで、週2回配送してほしいです。"
    );

    expect(result.menu_name).toBe("特製ポテトサラダ");
    expect(result.menu_category).toBe("side_dish");
    expect(result.main_ingredients).toHaveLength(2);
    expect(result.desired_lot_size).toBe(500);
    expect(result.allergens).toContain("egg");
    expect(result.preservation_method).toBe("refrigerated");
  });

  it("コードブロックで囲まれたJSONも正しくパースする", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: '```json\n{"menu_name":"テスト","menu_category":"other","main_ingredients":[],"seasoning_direction":"塩味","allergens":[],"process_steps":[],"preservation_method":"frozen","required_certifications":[],"confidence_score":0.5}\n```',
        },
      ],
    });

    const { structurizeRecipeFromText } = await import(
      "@/lib/ai/structurize"
    );

    const result = await structurizeRecipeFromText("テスト入力");
    expect(result.menu_name).toBe("テスト");
  });
});
