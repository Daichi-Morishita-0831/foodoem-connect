"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { RecipeSpecForm } from "@/components/spec/recipe-spec-form";
import { RecipeSpecView } from "@/components/spec/recipe-spec-view";
import { Button } from "@/components/ui/button";
import { Mic, FileText, Loader2, Factory, Sparkles } from "lucide-react";
import { createProject } from "@/lib/supabase/actions/projects";
import { runMatching } from "@/lib/supabase/actions/matching";
import type { RecipeSpecInput } from "@/lib/schemas/recipe-spec";

type InputMode = "voice" | "form";

export default function NewProjectPage() {
  const [mode, setMode] = useState<InputMode>("voice");
  const [transcript, setTranscript] = useState<string | null>(null);
  const [structuredSpec, setStructuredSpec] = useState<RecipeSpecInput | null>(
    null
  );
  const [isStructuring, setIsStructuring] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);
  const [isFindingFactories, setIsFindingFactories] = useState(false);
  const router = useRouter();

  const handleTranscript = (text: string) => {
    setTranscript(text);
  };

  const handleStructurize = async () => {
    if (!transcript) return;

    setIsStructuring(true);
    setStructureError(null);

    try {
      const res = await fetch("/api/ai/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "構造化に失敗しました");
      }

      setStructuredSpec(data.spec);
    } catch (err) {
      setStructureError(
        err instanceof Error ? err.message : "エラーが発生しました"
      );
    } finally {
      setIsStructuring(false);
    }
  };

  const handleFindFactories = async () => {
    if (!structuredSpec) return;

    setIsFindingFactories(true);

    try {
      // 1. プロジェクト + レシピ仕様書を作成
      const projectResult = await createProject({
        title: structuredSpec.menu_name + "のOEM製造",
        spec: {
          raw_transcript: transcript,
          menu_name: structuredSpec.menu_name,
          menu_category: structuredSpec.menu_category,
          main_ingredients: structuredSpec.main_ingredients,
          seasoning_direction: structuredSpec.seasoning_direction,
          target_unit_cost: structuredSpec.target_unit_cost,
          target_selling_price: structuredSpec.target_selling_price,
          desired_lot_size: structuredSpec.desired_lot_size,
          delivery_frequency: structuredSpec.delivery_frequency,
          allergens: structuredSpec.allergens,
          process_steps: structuredSpec.process_steps,
          preservation_method: structuredSpec.preservation_method,
          shelf_life_days: structuredSpec.shelf_life_days,
          packaging_type: structuredSpec.packaging_type,
          required_certifications: structuredSpec.required_certifications,
          ai_confidence_score: structuredSpec.confidence_score,
        },
      });

      if ("error" in projectResult) {
        setStructureError(projectResult.error);
        return;
      }

      // 2. マッチング実行
      const matchResult = await runMatching(projectResult.projectId);

      if ("error" in matchResult) {
        // マッチングエラーでもプロジェクトは作成済みなので詳細ページへ
        router.push(`/projects/${projectResult.projectId}`);
        return;
      }

      // 3. マッチング結果ページへ遷移
      router.push(`/projects/${projectResult.projectId}/matches`);
    } catch (err) {
      setStructureError(
        err instanceof Error ? err.message : "エラーが発生しました"
      );
    } finally {
      setIsFindingFactories(false);
    }
  };

  const handleFormSubmit = async () => {
    // フォーム入力の場合は簡易的にプロジェクトを作成
    // TODO: フォームデータからRecipeSpecInputを構築
    router.push("/projects");
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
          {transcript && !structuredSpec && (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-2 font-medium text-gray-900">
                音声認識結果
              </h3>
              <p className="mb-4 text-sm text-gray-600">{transcript}</p>

              {structureError && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {structureError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={handleStructurize}
                  disabled={isStructuring}
                >
                  {isStructuring ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      AIが仕様書を作成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      AIで仕様書を自動作成
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTranscript(null);
                    setStructureError(null);
                  }}
                  disabled={isStructuring}
                >
                  もう一度話す
                </Button>
              </div>
            </div>
          )}

          {/* Structured Spec Result */}
          {structuredSpec && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                <Sparkles className="h-4 w-4" />
                AIが仕様書を自動作成しました！内容を確認してください。
              </div>

              <RecipeSpecView spec={structuredSpec} />

              {structureError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {structureError}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  size="lg"
                  onClick={handleFindFactories}
                  disabled={isFindingFactories}
                >
                  {isFindingFactories ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      工場を検索中...
                    </>
                  ) : (
                    <>
                      <Factory className="mr-2 h-4 w-4" />
                      この仕様で工場を探す
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStructuredSpec(null);
                    setTranscript(null);
                  }}
                  disabled={isFindingFactories}
                >
                  最初からやり直す
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
