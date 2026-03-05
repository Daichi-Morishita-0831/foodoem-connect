"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchScoreBadge } from "./match-score-badge";
import { InquiryCta } from "./inquiry-cta";
import { submitInquiry } from "@/lib/supabase/actions/inquiries";
import {
  Factory,
  MapPin,
  Package,
  Shield,
  Truck,
  Eye,
  Lock,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import type { MatchResult } from "@/types";

export function FactoryCard({ match }: { match: MatchResult }) {
  const [isRevealed, setIsRevealed] = useState(match.is_revealed);
  const [inquiryError, setInquiryError] = useState<string | null>(null);
  const profile = match.oem_profile;
  if (!profile) return null;

  const handleInquiry = async (message: string) => {
    // 楽観的UI更新
    setIsRevealed(true);
    setInquiryError(null);

    const result = await submitInquiry(match.id, message);

    if ("error" in result) {
      // エラー時はロールバック
      if (!match.is_revealed) {
        setIsRevealed(false);
      }
      setInquiryError(result.error);
    }
  };

  // モザイク用：工場名を伏せ字に
  const maskedName = profile.description
    ? profile.description.slice(0, 3) + "●●●食品"
    : "●●●食品";

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* ヘッダー: マッチ度 + ステータス */}
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-gray-50 to-white pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
            <Factory className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            {isRevealed ? (
              <h3 className="font-bold text-gray-900">
                {profile.production_area}の惣菜工場
              </h3>
            ) : (
              <h3 className="font-bold text-gray-900">
                <span className="inline-flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-gray-400" />
                  <span className="blur-[4px] select-none">{maskedName}</span>
                </span>
              </h3>
            )}
            <p className="text-sm text-gray-500">
              {isRevealed ? profile.production_area : "エリア: 関東"}
            </p>
          </div>
        </div>
        <MatchScoreBadge score={match.match_score} />
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* 開示情報（常に見える） */}
        <div className="space-y-3">
          {/* 得意分野 */}
          <div className="flex items-start gap-2">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">得意分野</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {(profile.specialties as string[]).map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 認証 */}
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">取得認証</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {(profile.certifications as string[]).map((c) => (
                  <Badge
                    key={c}
                    variant="outline"
                    className="border-green-200 bg-green-50 text-xs text-green-700"
                  >
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* ロット */}
          <div className="flex items-start gap-2">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">対応ロット</p>
              <p className="text-sm text-gray-700">
                {profile.min_lot_size?.toLocaleString()}個 〜{" "}
                {profile.max_lot_size?.toLocaleString()}個
              </p>
            </div>
          </div>

          {/* 配送エリア */}
          <div className="flex items-start gap-2">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-xs font-medium text-gray-500">配送エリア</p>
              <p className="text-sm text-gray-700">
                {(profile.delivery_areas as string[]).join("、")}
              </p>
            </div>
          </div>
        </div>

        {/* マッチ理由 */}
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="mb-2 text-xs font-medium text-gray-500">
            マッチング理由
          </p>
          <div className="space-y-1.5">
            {match.match_reasons.map((reason, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {reason.is_match ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-amber-500" />
                )}
                <span className="text-gray-700">{reason.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* エラーメッセージ */}
        {inquiryError && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {inquiryError}
          </div>
        )}

        {/* 非開示情報（モザイク） */}
        {!isRevealed && (
          <div className="relative overflow-hidden rounded-lg border border-dashed border-gray-200 p-4">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />
            <div className="blur-[6px]">
              <p className="text-sm text-gray-600">
                <MapPin className="mr-1 inline h-3.5 w-3.5" />
                {profile.production_area}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                TEL: 0XX-XXXX-XXXX
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {profile.description?.slice(0, 50)}...
              </p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-600 shadow-sm backdrop-blur">
                <Eye className="h-4 w-4" />
                問い合わせで開示されます
              </div>
            </div>
          </div>
        )}

        {/* 開示済み情報 */}
        {isRevealed && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-green-700">
              <Eye className="h-4 w-4" />
              工場情報が開示されました
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <MapPin className="mr-1 inline h-3.5 w-3.5 text-gray-400" />
                {profile.production_area}
              </p>
              <p className="text-sm text-gray-600">{profile.description}</p>
            </div>
          </div>
        )}

        {/* CTA */}
        {!isRevealed ? (
          <InquiryCta
            factoryName={maskedName}
            matchScore={match.match_score}
            onInquiry={handleInquiry}
          />
        ) : (
          <div className="text-center text-sm text-gray-500">
            メッセージ機能で工場と直接やりとりできます
          </div>
        )}
      </CardContent>
    </Card>
  );
}
