import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { redirect } from "next/navigation";
import { PricingCards } from "@/components/settings/pricing-cards";
import { BillingHistory } from "@/components/settings/billing-history";
import { CurrentPlan } from "@/components/settings/current-plan";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "課金設定",
};

export default async function BillingPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", currentUser.authUser.id)
    .single();

  const { data: payments } = await supabase
    .from("payment_history")
    .select("*")
    .eq("user_id", currentUser.authUser.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">課金設定</h1>
        <p className="mt-1 text-sm text-gray-500">
          プランの確認・変更、請求履歴の確認ができます。
        </p>
      </div>

      <CurrentPlan subscription={subscription} />
      <PricingCards currentPlan={subscription?.plan || "free"} />
      <BillingHistory payments={payments || []} />
    </div>
  );
}
