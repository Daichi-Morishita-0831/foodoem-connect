import { NextRequest, NextResponse } from "next/server";
import { structurizeRecipeFromText } from "@/lib/ai/structurize";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(request: NextRequest) {
  try {
    // レートリミット: IPあたり1分間に10リクエスト
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(ip, 10, 60_000)) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくしてからお試しください。" },
        { status: 429 }
      );
    }

    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 }
      );
    }

    // 入力サニタイズ（最大5000文字）
    const sanitized = sanitizeInput(transcript, 5000);
    if (sanitized.length === 0) {
      return NextResponse.json(
        { error: "有効な入力がありません" },
        { status: 400 }
      );
    }

    const spec = await structurizeRecipeFromText(sanitized);

    return NextResponse.json({ success: true, spec });
  } catch (error) {
    console.error("Structurize error:", error);
    return NextResponse.json(
      { error: "構造化に失敗しました" },
      { status: 500 }
    );
  }
}
