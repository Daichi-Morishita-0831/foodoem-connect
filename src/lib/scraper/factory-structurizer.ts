/**
 * 工場データ収集パイプライン（Claude Code駆動）
 *
 * 3つの収集経路:
 * 1. 公開データクローリング → Claude構造化
 *    - 自治体の食品製造業許認可リスト
 *    - 企業HPの会社概要・設備情報
 * 2. 展示会出展者リスト解析
 *    - FABEX、フードテック等の出展者リスト
 * 3. OEM業者セルフ登録（音声対応）
 *
 * このファイルはClaude Codeから直接呼び出して
 * 工場データを構造化・蓄積するためのユーティリティ。
 */

import Anthropic from "@anthropic-ai/sdk";
import type { OemProfile } from "@/types";

const client = new Anthropic();

const FACTORY_EXTRACTION_PROMPT = `あなたは食品OEM業界の専門家です。
以下のWebページテキストから、OEM食品製造工場の情報を構造化してください。

抽出する情報:
- company_name: 会社名
- specialties: 得意分野（惣菜、ソース、冷凍食品、等）
- certifications: 保有認証（HACCP、ISO22000、FSSC22000、有機JAS、ハラール等）
- min_lot_size: 最小ロット数（推定OK）
- max_lot_size: 最大ロット数（推定OK）
- production_area: 製造拠点の所在地
- delivery_areas: 配送可能エリア
- description: 会社・工場の概要（100文字程度）
- contact_info: 連絡先情報（電話、メール、URL）

情報が不明な場合はnull。推測は「推定」と明記。
JSON配列で出力。1ページに複数工場がある場合は複数出力。`;

/**
 * Webページのテキストから工場情報を構造化
 * Claude Codeから呼び出して使う
 */
export async function extractFactoriesFromText(
  pageText: string,
  sourceUrl: string
): Promise<Array<Partial<OemProfile> & { company_name: string; contact_info?: string; source_url: string }>> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: FACTORY_EXTRACTION_PROMPT,
    messages: [
      {
        role: "user",
        content: `【ソースURL】${sourceUrl}\n\n【ページテキスト】\n${pageText.slice(0, 10000)}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude APIからテキスト応答を取得できませんでした");
  }

  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const factories = JSON.parse(jsonStr);
  return factories.map((f: Record<string, unknown>) => ({
    ...f,
    source_url: sourceUrl,
  }));
}

/**
 * 展示会出展者リストから工場情報を一括構造化
 */
export async function extractFactoriesFromExhibitorList(
  listText: string,
  eventName: string
): Promise<Array<Partial<OemProfile> & { company_name: string }>> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: `あなたは食品OEM業界の専門家です。
以下の展示会「${eventName}」の出展者リストから、
OEM製造を受託する可能性のある食品工場を抽出・構造化してください。

OEM受託の可能性が低い企業（原料メーカー、機械メーカー等）は除外。
JSON配列で出力。`,
    messages: [
      {
        role: "user",
        content: listText.slice(0, 15000),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude APIからテキスト応答を取得できませんでした");
  }

  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  return JSON.parse(jsonStr);
}

/**
 * 自治体の食品営業許可リストから惣菜製造業者を抽出
 */
export async function extractFromPermitList(
  listText: string,
  prefecture: string
): Promise<Array<{ company_name: string; address: string; permit_type: string }>> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: `以下の${prefecture}の食品営業許可一覧から、
「惣菜製造業」「そうざい製造業」「食品製造業」の許可を持つ事業者を抽出してください。
個人の飲食店は除外し、製造業としての規模がありそうな事業者のみ抽出。
JSON配列で出力: [{company_name, address, permit_type}]`,
    messages: [
      {
        role: "user",
        content: listText.slice(0, 15000),
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude APIからテキスト応答を取得できませんでした");
  }

  let jsonStr = textBlock.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  return JSON.parse(jsonStr);
}
