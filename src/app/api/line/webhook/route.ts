import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import {
  replyMessage,
  getWelcomeMessages,
} from "@/lib/line/messaging";

interface LineWebhookEvent {
  type: string;
  replyToken?: string;
  source?: {
    type: string;
    userId?: string;
  };
  message?: {
    type: string;
    text: string;
  };
}

interface LineWebhookBody {
  events: LineWebhookEvent[];
}

function verifySignature(body: string, signature: string): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) return false;
  const hash = crypto
    .createHmac("SHA256", secret)
    .update(body)
    .digest("base64");
  return hash === signature;
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("x-line-signature");

  if (!signature || !verifySignature(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { events } = JSON.parse(body) as LineWebhookBody;

  for (const event of events) {
    switch (event.type) {
      case "follow": {
        // 友だち追加時の自動返信
        if (event.replyToken) {
          await replyMessage(event.replyToken, getWelcomeMessages());
        }
        break;
      }
      case "message": {
        // メッセージ受信（将来的にチャットボット対応可能）
        break;
      }
    }
  }

  return NextResponse.json({ received: true });
}
