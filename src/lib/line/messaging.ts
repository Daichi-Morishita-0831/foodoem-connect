const LINE_API_BASE = "https://api.line.me/v2/bot";

function getHeaders() {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function pushMessage(
  to: string,
  messages: LineMessage[]
): Promise<void> {
  await fetch(`${LINE_API_BASE}/message/push`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ to, messages }),
  });
}

export async function replyMessage(
  replyToken: string,
  messages: LineMessage[]
): Promise<void> {
  await fetch(`${LINE_API_BASE}/message/reply`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ replyToken, messages }),
  });
}

export async function getProfile(
  userId: string
): Promise<LineProfile | null> {
  const res = await fetch(`${LINE_API_BASE}/profile/${userId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) return null;
  return res.json();
}

// LINE Message Types
export interface LineTextMessage {
  type: "text";
  text: string;
}

export interface LineFlexMessage {
  type: "flex";
  altText: string;
  contents: Record<string, unknown>;
}

export type LineMessage = LineTextMessage | LineFlexMessage;

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// 友だち追加時の自動返信メッセージ
export function getWelcomeMessages(): LineMessage[] {
  return [
    {
      type: "text",
      text: "FoodOEM Connectへようこそ！\n\n飲食店とOEM工場をつなぐマッチングプラットフォームです。\n\nアカウントをお持ちの方はLINE連携で簡単ログインできます。",
    },
  ];
}
