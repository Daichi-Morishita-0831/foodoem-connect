"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Loader2 } from "lucide-react";

interface CostEstimate {
  estimatedUnitCost: { min: number; max: number };
  breakdown: { item: string; ratio: string; estimatedCost: string }[];
  notes: string;
}

export function CostEstimateCard({ specId }: { specId: string }) {
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchEstimate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specId }),
      });
      const data = await res.json();
      setEstimate(data.estimate || null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-blue-900">AI原価概算</h3>
        </div>
        {!estimate && (
          <Button
            size="sm"
            variant="outline"
            onClick={fetchEstimate}
            disabled={loading}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                推定中...
              </>
            ) : (
              "原価を推定"
            )}
          </Button>
        )}
      </div>

      {estimate && (
        <div className="mt-4 space-y-4">
          {/* 概算金額 */}
          <div className="rounded-md bg-white p-4 text-center shadow-sm">
            <p className="text-sm text-gray-500">推定製造原価 (1個あたり)</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">
              ¥{estimate.estimatedUnitCost.min.toLocaleString()} 〜 ¥
              {estimate.estimatedUnitCost.max.toLocaleString()}
            </p>
          </div>

          {/* 内訳 */}
          {estimate.breakdown.length > 0 && (
            <div className="rounded-md bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-medium text-gray-700">
                コスト内訳
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-1 text-left text-gray-500">項目</th>
                    <th className="py-1 text-right text-gray-500">構成比</th>
                    <th className="py-1 text-right text-gray-500">推定金額</th>
                  </tr>
                </thead>
                <tbody>
                  {estimate.breakdown.map((item, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-1 text-gray-900">{item.item}</td>
                      <td className="py-1 text-right text-gray-600">
                        {item.ratio}
                      </td>
                      <td className="py-1 text-right font-medium text-gray-900">
                        {item.estimatedCost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 注意事項 */}
          <p className="text-xs text-blue-600">{estimate.notes}</p>
        </div>
      )}
    </div>
  );
}
