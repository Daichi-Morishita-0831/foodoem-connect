"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { RecipeSpecForm } from "@/components/spec/recipe-spec-form";
import { Button } from "@/components/ui/button";
import { Mic, FileText } from "lucide-react";

type InputMode = "voice" | "form";

export default function NewProjectPage() {
  const [mode, setMode] = useState<InputMode>("voice");
  const [transcript, setTranscript] = useState<string | null>(null);
  const router = useRouter();

  const handleTranscript = (text: string) => {
    setTranscript(text);
  };

  const handleFormSubmit = () => {
    // デモ: マッチング結果ページへ遷移
    router.push("/projects/proj-001/matches");
  };

  const handleFindFactories = () => {
    router.push("/projects/proj-001/matches");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">新規OEM依頼</h1>
        <p className="mt-1 text-sm text-gray-500">
          音声またはフォームで、作りたいメニューの情報を入力してください
        </p>
      </div>

      {/* Input Mode Toggle */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={mode === "voice" ? "default" : "outline"}
          onClick={() => setMode("voice")}
          className={
            mode === "voice" ? "bg-orange-600 hover:bg-orange-700" : ""
          }
        >
          <Mic className="mr-2 h-4 w-4" />
          音声で入力
        </Button>
        <Button
          variant={mode === "form" ? "default" : "outline"}
          onClick={() => setMode("form")}
          className={
            mode === "form" ? "bg-orange-600 hover:bg-orange-700" : ""
          }
        >
          <FileText className="mr-2 h-4 w-4" />
          フォームで入力
        </Button>
      </div>

      {mode === "voice" ? (
        <div className="space-y-6">
          <VoiceRecorder onTranscript={handleTranscript} />

          {/* Transcript Result */}
          {transcript && (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-medium text-gray-900">
                音声認識結果
              </h3>
              <p className="mb-4 text-sm text-gray-600">{transcript}</p>
              <div className="flex gap-3">
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={handleFindFactories}
                >
                  この内容で工場を探す
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTranscript(null)}
                >
                  もう一度話す
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <RecipeSpecForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}
