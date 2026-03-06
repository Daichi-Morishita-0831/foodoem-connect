"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPlanById } from "@/lib/stripe/plans";
import { CreditCard, ExternalLink } from "lucide-react";

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export function CurrentPlan({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  const [loading, setLoading] = useState(false);
  const plan = getPlanById(subscription?.plan || "free");

  async function handleManageBilling() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    active: { label: "有効", variant: "default" },
    past_due: { label: "支払い遅延", variant: "destructive" },
    canceled: { label: "キャンセル済", variant: "outline" },
    trialing: { label: "トライアル中", variant: "secondary" },
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">現在のプラン</h2>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              {plan?.name || "フリー"}
            </span>
            {subscription && (
              <Badge
                variant={
                  statusLabels[subscription.status]?.variant || "outline"
                }
              >
                {statusLabels[subscription.status]?.label ||
                  subscription.status}
              </Badge>
            )}
          </div>

          {subscription && subscription.plan !== "free" && (
            <p className="mt-1 text-sm text-gray-500">
              {subscription.cancel_at_period_end
                ? `${new Date(subscription.current_period_end).toLocaleDateString("ja-JP")} に解約予定`
                : `次回請求日: ${new Date(subscription.current_period_end).toLocaleDateString("ja-JP")}`}
            </p>
          )}

          {!subscription && (
            <p className="mt-1 text-sm text-gray-500">
              無料プランをご利用中です。
            </p>
          )}
        </div>

        {subscription && subscription.plan !== "free" && (
          <Button
            variant="outline"
            onClick={handleManageBilling}
            disabled={loading}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {loading ? "読み込み中..." : "請求管理"}
          </Button>
        )}
      </div>
    </div>
  );
}
