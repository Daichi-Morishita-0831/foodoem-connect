"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type RecordingState = "idle" | "recording" | "processing";

export function VoiceRecorder({
  onTranscript,
}: {
  onTranscript?: (text: string) => void;
}) {
  const [state, setState] = useState<RecordingState>("idle");

  const handleToggleRecording = () => {
    if (state === "idle") {
      setState("recording");
      // Phase 2: 実際のWeb Audio API + Whisper連携
      // デモ用: 3秒後に自動停止→モック文字起こし
      setTimeout(() => {
        setState("processing");
        setTimeout(() => {
          setState("idle");
          onTranscript?.(
            "うちの肉じゃがなんだけど、牛肉とじゃがいもがメインで、甘辛い醤油ベースの味付け。原価は1個あたり150円くらいに抑えたいんだよね。500個から作ってほしくて、冷蔵で5日くらいもってほしい。"
          );
        }, 2000);
      }, 3000);
    } else if (state === "recording") {
      setState("processing");
      setTimeout(() => {
        setState("idle");
        onTranscript?.(
          "うちの肉じゃがなんだけど、牛肉とじゃがいもがメインで、甘辛い醤油ベースの味付け。原価は1個あたり150円くらいに抑えたいんだよね。500個から作ってほしくて、冷蔵で5日くらいもってほしい。"
        );
      }, 2000);
    }
  };

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center gap-6 py-12">
        {/* Recording Button */}
        <button
          onClick={handleToggleRecording}
          disabled={state === "processing"}
          className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-full transition-all",
            state === "idle" &&
              "bg-orange-100 text-orange-600 hover:bg-orange-200 hover:scale-105",
            state === "recording" &&
              "bg-red-100 text-red-600 animate-pulse",
            state === "processing" &&
              "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {state === "processing" ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : state === "recording" ? (
            <MicOff className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
          {state === "recording" && (
            <span className="absolute inset-0 animate-ping rounded-full bg-red-200 opacity-30" />
          )}
        </button>

        {/* Status Text */}
        <div className="text-center">
          {state === "idle" && (
            <>
              <p className="font-medium text-gray-900">
                タップして話しかけてください
              </p>
              <p className="mt-1 text-sm text-gray-500">
                作りたいメニュー、原価感、ロット数などを自由にお話しください
              </p>
            </>
          )}
          {state === "recording" && (
            <>
              <p className="font-medium text-red-600">録音中...</p>
              <p className="mt-1 text-sm text-gray-500">
                タップして録音を停止
              </p>
            </>
          )}
          {state === "processing" && (
            <>
              <p className="font-medium text-gray-700">
                AIが解析しています...
              </p>
              <p className="mt-1 text-sm text-gray-500">
                音声をテキストに変換しています
              </p>
            </>
          )}
        </div>

        {/* Hint */}
        <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p className="font-medium">話すヒント:</p>
          <ul className="mt-1 list-disc pl-4 text-amber-700">
            <li>どんなメニューを作りたいか</li>
            <li>使いたい食材・味付けの方向性</li>
            <li>1個あたりの原価目標</li>
            <li>何個から作ってほしいか（ロット数）</li>
            <li>冷蔵 or 冷凍、賞味期限の希望</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
