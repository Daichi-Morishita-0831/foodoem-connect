import { NextRequest, NextResponse } from "next/server";
import { structurizeRecipeFromText } from "@/lib/ai/structurize";

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json(
        { error: "transcript is required" },
        { status: 400 }
      );
    }

    const spec = await structurizeRecipeFromText(transcript);

    return NextResponse.json({ success: true, spec });
  } catch (error) {
    console.error("Structurize error:", error);
    return NextResponse.json(
      { error: "構造化に失敗しました" },
      { status: 500 }
    );
  }
}
