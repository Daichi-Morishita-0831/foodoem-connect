"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/stripe/plans";
import { Check } from "lucide-react";

export function PricingCards({ currentPlan }: { currentPlan: string }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleSubscribe(priceId: string) {
    setLoadingPlan(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        プラン一覧
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isHighlighted = plan.id === "premium";

          return (
            <div
              key={plan.id}
              className={`rounded-lg border p-6 ${
                isHighlighted
                  ? "border-orange-300 bg-orange-50 shadow-md"
                  : "bg-white"
              }`}
            >
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price === 0
                    ? "無料"
                    : `¥${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-gray-500"> /月</span>
                )}
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 flex-shrink-0 text-orange-600" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <Button disabled className="w-full" variant="outline">
                    現在のプラン
                  </Button>
                ) : plan.id === "free" ? (
                  <Button disabled className="w-full" variant="outline">
                    無料
                  </Button>
                ) : (
                  <Button
                    className={`w-full ${
                      isHighlighted
                        ? "bg-orange-600 hover:bg-orange-700"
                        : ""
                    }`}
                    onClick={() =>
                      plan.stripePriceId &&
                      handleSubscribe(plan.stripePriceId)
                    }
                    disabled={
                      !plan.stripePriceId || loadingPlan === plan.stripePriceId
                    }
                  >
                    {loadingPlan === plan.stripePriceId
                      ? "処理中..."
                      : "このプランに変更"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
