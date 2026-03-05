"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Check, X } from "lucide-react";
import Link from "next/link";
import { respondToInquiry } from "@/lib/supabase/actions/inquiries";
import { inquiryStatusLabels, inquiryStatusColors } from "@/lib/constants";
import type { InquiryWithDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function InquiryDetailContent({
  inquiry,
}: {
  inquiry: InquiryWithDetails;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRespond = async (status: "approved" | "rejected") => {
    setLoading(true);
    const result = await respondToInquiry(inquiry.id, status);
    setLoading(false);
    if ("error" in result) {
      alert(result.error);
      return;
    }
    router.push("/oem/inquiries");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/oem/inquiries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">問い合わせ詳細</h1>
          <Badge
            className={
              inquiryStatusColors[inquiry.status] ?? "bg-gray-100 text-gray-700"
            }
          >
            {inquiryStatusLabels[inquiry.status] ?? inquiry.status}
          </Badge>
        </div>
      </div>

      {/* 飲食店情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-500" />
            飲食店情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500">会社名</p>
              <p className="font-medium">{inquiry.restaurant?.company_name ?? "不明"}</p>
            </div>
            {inquiry.status === "approved" && inquiry.restaurant && (
              <>
                <div>
                  <p className="text-xs text-gray-500">担当者</p>
                  <p className="font-medium">
                    {inquiry.restaurant.representative_name ?? "未設定"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">電話番号</p>
                  <p className="font-medium">{inquiry.restaurant.phone ?? "未設定"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">住所</p>
                  <p className="font-medium">{inquiry.restaurant.address ?? "未設定"}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 問い合わせメッセージ */}
      {inquiry.message && (
        <Card>
          <CardHeader>
            <CardTitle>問い合わせメッセージ</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{inquiry.message}</p>
          </CardContent>
        </Card>
      )}

      {/* 案件・レシピ仕様 */}
      {inquiry.project && (
        <Card>
          <CardHeader>
            <CardTitle>案件: {inquiry.project.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {inquiry.recipe_spec ? (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoItem label="メニュー名" value={inquiry.recipe_spec.menu_name} />
                  <InfoItem
                    label="希望ロット"
                    value={
                      inquiry.recipe_spec.desired_lot_size
                        ? `${inquiry.recipe_spec.desired_lot_size.toLocaleString()}個`
                        : "未設定"
                    }
                  />
                  <InfoItem
                    label="保存方法"
                    value={
                      inquiry.recipe_spec.preservation_method === "refrigerated"
                        ? "冷蔵"
                        : inquiry.recipe_spec.preservation_method === "frozen"
                        ? "冷凍"
                        : "常温"
                    }
                  />
                  <InfoItem
                    label="目標原価"
                    value={
                      inquiry.recipe_spec.target_unit_cost
                        ? `${inquiry.recipe_spec.target_unit_cost}円`
                        : "未設定"
                    }
                  />
                </div>
                {inquiry.recipe_spec.required_certifications.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">必要認証</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {inquiry.recipe_spec.required_certifications.map((cert) => (
                        <Badge key={cert} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">レシピ仕様がありません</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* マッチングスコア */}
      {inquiry.match_result && (
        <Card>
          <CardHeader>
            <CardTitle>マッチングスコア</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-3xl font-bold text-orange-600">
              {inquiry.match_result.match_score}点
            </div>
            {inquiry.match_result.match_reasons.length > 0 && (
              <div className="space-y-1">
                {inquiry.match_result.match_reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {reason.is_match ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    )}
                    <span>
                      <span className="font-medium">{reason.category}:</span>{" "}
                      {reason.description}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 承認/却下ボタン */}
      {inquiry.status === "pending" && (
        <div className="flex gap-3">
          <Button
            onClick={() => handleRespond("approved")}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="mr-2 h-4 w-4" />
            承認する
          </Button>
          <Button
            onClick={() => handleRespond("rejected")}
            disabled={loading}
            variant="outline"
            className="flex-1 text-red-600 hover:bg-red-50"
          >
            <X className="mr-2 h-4 w-4" />
            辞退する
          </Button>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  );
}
