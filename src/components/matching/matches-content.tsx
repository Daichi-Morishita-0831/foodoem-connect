"use client";

import { useState, useEffect } from "react";
import { FactoryCard } from "./factory-card";
import { Sparkles, Loader2 } from "lucide-react";
import type { MatchResult } from "@/types";

export function MatchesContent({ matches }: { matches: MatchResult[] }) {
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // ローディング演出
    const timer1 = setTimeout(() => {
      setLoading(false);
    }, 2500);
    const timer2 = setTimeout(() => {
      setShowResults(true);
    }, 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <>
      {/* Loading Animation */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
            </div>
            <Sparkles className="absolute -right-2 -top-2 h-6 w-6 animate-pulse text-amber-500" />
          </div>
          <p className="text-lg font-medium text-gray-900">
            AIが最適な工場を検索中...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            認証・ロット・得意分野・配送エリアから総合的にマッチング
          </p>
          <div className="mt-6 flex gap-3">
            {["認証チェック", "ロット適合", "エリア確認"].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      {!loading && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4">
          <Sparkles className="h-6 w-6 text-orange-600" />
          <div>
            <p className="font-bold text-gray-900">
              {matches.length}件の工場が見つかりました！
            </p>
            <p className="text-sm text-gray-600">
              マッチ度の高い順に表示しています
            </p>
          </div>
        </div>
      )}

      {/* Match Cards */}
      {showResults && (
        <div className="space-y-6">
          {matches
            .sort((a, b) => b.match_score - a.match_score)
            .map((match) => (
              <FactoryCard key={match.id} match={match} />
            ))}
        </div>
      )}
    </>
  );
}
