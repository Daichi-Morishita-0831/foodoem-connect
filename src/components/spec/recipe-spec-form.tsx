"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  menuCategoryLabels,
  preservationMethodLabels,
  allergenLabels,
} from "@/lib/schemas/recipe-spec";
import { Check, ChefHat } from "lucide-react";

// Phase1: 音声の代わりにフォーム入力
export function RecipeSpecForm({
  onSubmit,
}: {
  onSubmit?: (data: Record<string, unknown>) => void;
}) {
  const [formData, setFormData] = useState({
    menu_name: "",
    menu_category: "side_dish",
    seasoning_direction: "",
    target_unit_cost: "",
    desired_lot_size: "",
    preservation_method: "refrigerated",
    shelf_life_days: "",
    packaging_type: "",
    required_certifications: [] as string[],
    additional_notes: "",
  });

  const certificationOptions = ["HACCP", "ISO22000", "FSSC22000", "有機JAS", "ハラール"];

  const toggleCertification = (cert: string) => {
    setFormData((prev) => ({
      ...prev,
      required_certifications: prev.required_certifications.includes(cert)
        ? prev.required_certifications.filter((c) => c !== cert)
        : [...prev.required_certifications, cert],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-orange-600" />
          メニュー仕様を入力
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* メニュー名 */}
        <div className="space-y-2">
          <Label htmlFor="menu_name">メニュー名</Label>
          <Input
            id="menu_name"
            placeholder="例: 特製牛肉じゃが"
            value={formData.menu_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, menu_name: e.target.value }))
            }
          />
        </div>

        {/* カテゴリ */}
        <div className="space-y-2">
          <Label>カテゴリ</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(menuCategoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, menu_category: key }))
                }
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  formData.menu_category === key
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 味付けの方向性 */}
        <div className="space-y-2">
          <Label htmlFor="seasoning">味付けの方向性</Label>
          <Input
            id="seasoning"
            placeholder="例: 甘辛醤油ベース、塩麹風味"
            value={formData.seasoning_direction}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seasoning_direction: e.target.value,
              }))
            }
          />
        </div>

        {/* 原価・ロット */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cost">ターゲット原価（円/個）</Label>
            <Input
              id="cost"
              type="number"
              placeholder="例: 150"
              value={formData.target_unit_cost}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  target_unit_cost: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lot">希望ロット数</Label>
            <Input
              id="lot"
              type="number"
              placeholder="例: 500"
              value={formData.desired_lot_size}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  desired_lot_size: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* 保存方法 */}
        <div className="space-y-2">
          <Label>保存方法</Label>
          <div className="flex gap-2">
            {Object.entries(preservationMethodLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    preservation_method: key,
                  }))
                }
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  formData.preservation_method === key
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 賞味期限 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="shelf_life">希望賞味期限（日数）</Label>
            <Input
              id="shelf_life"
              type="number"
              placeholder="例: 5"
              value={formData.shelf_life_days}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shelf_life_days: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="packaging">包装形態</Label>
            <Input
              id="packaging"
              placeholder="例: 真空パック、トレー"
              value={formData.packaging_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  packaging_type: e.target.value,
                }))
              }
            />
          </div>
        </div>

        {/* 必要認証 */}
        <div className="space-y-2">
          <Label>必要な認証</Label>
          <div className="flex flex-wrap gap-2">
            {certificationOptions.map((cert) => (
              <button
                key={cert}
                onClick={() => toggleCertification(cert)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition ${
                  formData.required_certifications.includes(cert)
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {formData.required_certifications.includes(cert) && (
                  <Check className="h-3.5 w-3.5" />
                )}
                {cert}
              </button>
            ))}
          </div>
        </div>

        {/* 補足 */}
        <div className="space-y-2">
          <Label htmlFor="notes">その他の要望・補足</Label>
          <Textarea
            id="notes"
            placeholder="特別な要望やこだわりがあれば記入してください"
            value={formData.additional_notes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                additional_notes: e.target.value,
              }))
            }
          />
        </div>

        <Button
          className="w-full bg-orange-600 hover:bg-orange-700"
          size="lg"
          onClick={() => onSubmit?.(formData)}
        >
          工場を探す
        </Button>
      </CardContent>
    </Card>
  );
}
