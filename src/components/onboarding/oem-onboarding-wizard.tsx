"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateOemProfile } from "@/lib/supabase/actions/oem-profile";
import {
  specialtyOptions,
  certificationOptions,
  deliveryAreaOptions,
} from "@/lib/schemas/oem-profile";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const steps = [
  { title: "得意分野", description: "製造が得意なカテゴリを選択してください" },
  { title: "認証・資格", description: "取得済みの認証を選択してください" },
  { title: "配送エリア", description: "対応可能なエリアを選択してください" },
  { title: "詳細情報", description: "ロット範囲と紹介文を入力してください" },
];

interface OemOnboardingWizardProps {
  currentProfile?: {
    specialties: string[];
    certifications: string[];
    delivery_areas: string[];
    min_lot_size: number;
    max_lot_size: number;
    production_area: string;
    description: string;
  };
}

export function OemOnboardingWizard({
  currentProfile,
}: OemOnboardingWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(0);

  const [specialties, setSpecialties] = useState<string[]>(
    currentProfile?.specialties ?? []
  );
  const [certifications, setCertifications] = useState<string[]>(
    currentProfile?.certifications ?? []
  );
  const [deliveryAreas, setDeliveryAreas] = useState<string[]>(
    currentProfile?.delivery_areas ?? []
  );
  const [minLot, setMinLot] = useState(
    currentProfile?.min_lot_size?.toString() ?? ""
  );
  const [maxLot, setMaxLot] = useState(
    currentProfile?.max_lot_size?.toString() ?? ""
  );
  const [productionArea, setProductionArea] = useState(
    currentProfile?.production_area ?? ""
  );
  const [description, setDescription] = useState(
    currentProfile?.description ?? ""
  );

  function toggleItem(
    list: string[],
    setList: (v: string[]) => void,
    item: string
  ) {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
    );
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateOemProfile({
        specialties,
        certifications,
        delivery_areas: deliveryAreas,
        min_lot_size: minLot ? Number(minLot) : 0,
        max_lot_size: maxLot ? Number(maxLot) : 0,
        production_area: productionArea || "未設定",
        description: description || "未設定",
      });
      if ("error" in result) {
        alert(result.error);
      } else {
        router.push("/oem/dashboard");
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i < step
                  ? "bg-green-100 text-green-700"
                  : i === step
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 ${i < step ? "bg-green-300" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            {steps[step].title}
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            {steps[step].description}
          </p>

          {/* Step 0: 得意分野 */}
          {step === 0 && (
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleItem(specialties, setSpecialties, opt)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    specialties.includes(opt)
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: 認証 */}
          {step === 1 && (
            <div className="flex flex-wrap gap-2">
              {certificationOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    toggleItem(certifications, setCertifications, opt)
                  }
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    certifications.includes(opt)
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Step 2: 配送エリア */}
          {step === 2 && (
            <div className="flex flex-wrap gap-2">
              {deliveryAreaOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    toggleItem(deliveryAreas, setDeliveryAreas, opt)
                  }
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    deliveryAreas.includes(opt)
                      ? "border-orange-600 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Step 3: 詳細情報 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    最小ロット
                  </label>
                  <input
                    type="number"
                    value={minLot}
                    onChange={(e) => setMinLot(e.target.value)}
                    placeholder="例: 100"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    最大ロット
                  </label>
                  <input
                    type="number"
                    value={maxLot}
                    onChange={(e) => setMaxLot(e.target.value)}
                    placeholder="例: 10000"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  製造拠点
                </label>
                <input
                  type="text"
                  value={productionArea}
                  onChange={(e) => setProductionArea(e.target.value)}
                  placeholder="例: 埼玉県川口市"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  工場紹介文
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="得意な製品や設備の特徴などをご記入ください"
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              戻る
            </Button>

            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>
                次へ
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : null}
                保存して始める
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
