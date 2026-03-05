"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  menuCategoryLabels,
  preservationMethodLabels,
  allergenLabels,
} from "@/lib/schemas/recipe-spec";
import type { RecipeSpecInput } from "@/lib/schemas/recipe-spec";
import {
  ChefHat,
  Package,
  Thermometer,
  Clock,
  Shield,
  Truck,
} from "lucide-react";

export function RecipeSpecView({ spec }: { spec: RecipeSpecInput }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-orange-600" />
          AI生成レシピ仕様書
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* 基本情報 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-gray-500">メニュー名</p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {spec.menu_name}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">カテゴリ</p>
            <Badge variant="secondary" className="mt-1">
              {menuCategoryLabels[spec.menu_category] || spec.menu_category}
            </Badge>
          </div>
        </div>

        {/* 味付け */}
        <div>
          <p className="text-xs font-medium text-gray-500">味付けの方向性</p>
          <p className="mt-1 text-sm text-gray-700">
            {spec.seasoning_direction}
          </p>
        </div>

        {/* 食材 */}
        <div>
          <p className="mb-2 text-xs font-medium text-gray-500">メイン食材</p>
          <div className="flex flex-wrap gap-2">
            {spec.main_ingredients.map((ing) => (
              <Badge key={ing.name} variant="outline" className="text-sm">
                {ing.name}
                {ing.approximate_ratio && (
                  <span className="ml-1 text-gray-400">
                    ({ing.approximate_ratio})
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>

        {/* コスト・ロット */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">ターゲット原価</p>
            <p className="text-lg font-bold text-gray-900">
              {spec.target_unit_cost
                ? `${spec.target_unit_cost}円/個`
                : "未定"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">希望ロット</p>
            <p className="text-lg font-bold text-gray-900">
              <Package className="mr-1 inline h-4 w-4 text-gray-400" />
              {spec.desired_lot_size
                ? `${spec.desired_lot_size.toLocaleString()}個〜`
                : "未定"}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs text-gray-500">配送頻度</p>
            <p className="text-lg font-bold text-gray-900">
              <Truck className="mr-1 inline h-4 w-4 text-gray-400" />
              {spec.delivery_frequency || "未定"}
            </p>
          </div>
        </div>

        {/* 保存 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">保存方法</p>
              <p className="font-medium">
                {preservationMethodLabels[spec.preservation_method] ||
                  spec.preservation_method}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">賞味期限</p>
              <p className="font-medium">
                {spec.shelf_life_days
                  ? `${spec.shelf_life_days}日間`
                  : "未定"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">包装</p>
              <p className="font-medium">{spec.packaging_type || "未定"}</p>
            </div>
          </div>
        </div>

        {/* アレルゲン */}
        {spec.allergens.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">
              含有アレルゲン
            </p>
            <div className="flex flex-wrap gap-1.5">
              {spec.allergens.map((a) => (
                <Badge
                  key={a}
                  className="bg-red-50 text-red-700 border-red-200"
                  variant="outline"
                >
                  {allergenLabels[a] || a}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 認証 */}
        {spec.required_certifications.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">
              <Shield className="mr-1 inline h-3.5 w-3.5" />
              必要認証
            </p>
            <div className="flex flex-wrap gap-1.5">
              {spec.required_certifications.map((c) => (
                <Badge
                  key={c}
                  className="bg-green-50 text-green-700 border-green-200"
                  variant="outline"
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 製造工程 */}
        {spec.process_steps.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-medium text-gray-500">
              想定製造工程
            </p>
            <div className="space-y-3">
              {spec.process_steps.map((step) => (
                <div key={step.order} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                    {step.order}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{step.description}</p>
                    <div className="mt-0.5 flex gap-3 text-xs text-gray-400">
                      {step.temperature && (
                        <span>温度: {step.temperature}</span>
                      )}
                      {step.duration && <span>時間: {step.duration}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI信頼度 */}
        <div className="rounded-lg bg-blue-50 p-3 text-sm">
          <span className="font-medium text-blue-700">
            AI構造化信頼度:{" "}
            {(spec.confidence_score * 100).toFixed(0)}%
          </span>
          <span className="ml-2 text-blue-600">
            音声から自動生成された仕様です。内容を確認・修正してください。
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
