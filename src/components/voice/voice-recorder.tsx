"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";

export function VoiceRecorder({
  onTranscript,
}: {
  onTranscript?: (text: string) => void;
}) {
  const {
    state,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startRecording,
    stopRecording,
  } = useVoiceRecorder();

  const handleToggle = () => {
    if (state === "recording") {
      stopRecording();
      // 録音停止時にfinal transcriptがあれば通知
      if (transcript) {
        onTranscript?.(transcript);
      }
    } else {
      startRecording();
    }
  };

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center gap-6 py-12">
        {/* Recording Button */}
        <button
          onClick={handleToggle}
          disabled={!isSupported}
          className={cn(
            "relative flex h-24 w-24 items-center justify-center rounded-full transition-all",
            state === "idle" &&
              "bg-orange-100 text-orange-600 hover:bg-orange-200 hover:scale-105",
            state === "recording" && "bg-red-100 text-red-600 animate-pulse",
            !isSupported && "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {state === "recording" ? (
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
          {!isSupported && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">
                お使いのブラウザは音声認識に対応していません。Chromeを推奨します。
              </p>
            </div>
          )}
          {isSupported && state === "idle" && !transcript && (
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
          {isSupported && state === "idle" && transcript && (
            <p className="font-medium text-green-600">
              音声認識完了！下に結果が表示されています
            </p>
          )}
        </div>

        {/* Live Transcript */}
        {(transcript || interimTranscript) && (
          <div className="w-full rounded-lg bg-gray-50 p-4 text-sm">
            <p className="mb-1 text-xs font-medium text-gray-500">
              認識テキスト:
            </p>
            <p className="text-gray-700">
              {transcript}
              {interimTranscript && (
                <span className="text-gray-400">{interimTranscript}</span>
              )}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

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
