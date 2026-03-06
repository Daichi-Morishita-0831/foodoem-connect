import Anthropic from "@anthropic-ai/sdk";
import type { MatchReason } from "@/types";

const anthropic = new Anthropic();

/**
 * AIによるマッチ理由の自然言語説明生成
 */
export async function generateMatchExplanation(
  factoryName: string,
  matchScore: number,
  matchReasons: MatchReason[],
  menuName: string
): Promise<string> {
  const reasonsSummary = matchReasons
    .map(
      (r) => `${r.is_match ? "○" : "×"} ${r.category}: ${r.description}`
    )
    .join("\n");

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system:
      "あなたは食品OEMマッチングの専門家です。マッチング結果を飲食店オーナー向けにわかりやすく1〜2文で説明してください。敬語で、具体的に。",
    messages: [
      {
        role: "user",
        content: `「${menuName}」に対する${factoryName}のマッチングスコア: ${matchScore}点\n\n理由:\n${reasonsSummary}\n\n上記を飲食店オーナー向けに簡潔に説明してください。`,
      },
    ],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}
