import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectStatusBadge } from "@/components/project/project-status-badge";
import { getProject, getRecipeSpec } from "@/lib/supabase/queries/projects";
import {
  menuCategoryLabels,
  preservationMethodLabels,
  allergenLabels,
} from "@/lib/schemas/recipe-spec";
import {
  ArrowLeft,
  ArrowRight,
  ChefHat,
  Package,
  Thermometer,
  Clock,
  Shield,
  Factory,
} from "lucide-react";
import { DocumentUpload } from "@/components/project/document-upload";
import { ProjectTimeline } from "@/components/project/project-timeline";
import { AiSuggestions } from "@/components/project/ai-suggestions";
import { CostEstimateCard } from "@/components/project/cost-estimate-card";
import { getProjectTimeline } from "@/lib/supabase/queries/project-events";
import type { Ingredient, ProcessStep } from "@/types";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const [spec, timeline] = await Promise.all([
    getRecipeSpec(id),
    getProjectTimeline(id),
  ]);

  return (
    <div>
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        案件一覧に戻る
      </Link>

      {/* Project Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <ProjectStatusBadge status={project.status} />
            <span className="text-sm text-gray-500">
              作成日:{" "}
              {new Date(project.created_at).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>
        {project.status === "matching" && (
          <Link href={`/projects/${project.id}/matches`}>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Factory className="mr-2 h-4 w-4" />
              マッチング結果を見る
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Recipe Spec */}
      {spec && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                レシピ仕様書 v{spec.version}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 基本情報 */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    メニュー名
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {spec.menu_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    カテゴリ
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {menuCategoryLabels[spec.menu_category]}
                  </Badge>
                </div>
              </div>

              {/* 味付け */}
              <div>
                <p className="text-xs font-medium text-gray-500">
                  味付けの方向性
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  {spec.seasoning_direction}
                </p>
              </div>

              {/* 食材 */}
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">
                  メイン食材
                </p>
                <div className="flex flex-wrap gap-2">
                  {(spec.main_ingredients as Ingredient[]).map((ing) => (
                    <Badge
                      key={ing.name}
                      variant="outline"
                      className="text-sm"
                    >
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
                      {preservationMethodLabels[spec.preservation_method]}
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
                    <p className="font-medium">
                      {spec.packaging_type || "未定"}
                    </p>
                  </div>
                </div>
              </div>

              {/* アレルゲン */}
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">
                  含有アレルゲン
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(spec.allergens as string[]).map((a) => (
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

              {/* 認証 */}
              <div>
                <p className="mb-2 text-xs font-medium text-gray-500">
                  <Shield className="mr-1 inline h-3.5 w-3.5" />
                  必要認証
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(spec.required_certifications as string[]).map((c) => (
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

              {/* 製造工程 */}
              <div>
                <p className="mb-3 text-xs font-medium text-gray-500">
                  想定製造工程
                </p>
                <div className="space-y-3">
                  {(spec.process_steps as ProcessStep[]).map((step) => (
                    <div
                      key={step.order}
                      className="flex items-start gap-3"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                        {step.order}
                      </div>
                      <div>
                        <p className="text-sm text-gray-700">
                          {step.description}
                        </p>
                        <div className="mt-0.5 flex gap-3 text-xs text-gray-400">
                          {step.temperature && (
                            <span>温度: {step.temperature}</span>
                          )}
                          {step.duration && (
                            <span>時間: {step.duration}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI信頼度 */}
              {spec.ai_confidence_score && (
                <div className="rounded-lg bg-blue-50 p-3 text-sm">
                  <span className="font-medium text-blue-700">
                    AI構造化信頼度:{" "}
                    {(Number(spec.ai_confidence_score) * 100).toFixed(0)}%
                  </span>
                  <span className="ml-2 text-blue-600">
                    音声から自動生成された仕様です。内容を確認・修正してください。
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI仕様提案 & 原価概算 */}
          <div className="grid gap-4 md:grid-cols-2">
            <AiSuggestions specId={spec.id} />
            <CostEstimateCard specId={spec.id} />
          </div>

          {/* 音声原文 */}
          {spec.raw_transcript && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  音声認識原文
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 italic">
                  &ldquo;{spec.raw_transcript}&rdquo;
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* タイムライン */}
      {timeline.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">
              案件タイムライン
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectTimeline events={timeline} />
          </CardContent>
        </Card>
      )}

      {/* ドキュメント（商談以降で表示） */}
      {project.oem_id && <DocumentUpload projectId={project.id} />}
    </div>
  );
}
