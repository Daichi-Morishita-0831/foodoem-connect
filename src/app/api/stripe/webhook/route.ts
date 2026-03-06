import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";
import { getPlanByPriceId } from "@/lib/stripe/plans";

// Webhook処理にはservice_roleクライアントを使用
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = getAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );
        await syncSubscription(supabase, subscription);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        invoice.parent?.subscription_details?.subscription;
      if (subscriptionId) {
        const subscription = await getStripe().subscriptions.retrieve(
          subscriptionId as string
        );
        await syncSubscription(supabase, subscription);
      }

      // 支払い履歴を記録
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;
      // Stripe v20+ ではpayment_intentがInvoice型から削除されている
      const rawInvoice = event.data.object as unknown as Record<string, unknown>;
      const paymentIntentId =
        typeof rawInvoice.payment_intent === "string"
          ? rawInvoice.payment_intent
          : null;

      if (customerId && paymentIntentId) {
        const { data: user } = await supabase
          .from("users")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (user) {
          await supabase.from("payment_history").upsert(
            {
              user_id: user.id,
              stripe_payment_intent_id: paymentIntentId,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: "succeeded",
              description: invoice.lines.data[0]?.description || null,
            },
            { onConflict: "stripe_payment_intent_id" }
          );
        }
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(supabase, subscription);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function syncSubscription(
  supabase: ReturnType<typeof getAdminClient>,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!user) return;

  const priceId = subscription.items.data[0]?.price.id;
  const plan = getPlanByPriceId(priceId);

  const statusMap: Record<string, string> = {
    active: "active",
    past_due: "past_due",
    canceled: "canceled",
    incomplete: "incomplete",
    trialing: "trialing",
    unpaid: "unpaid",
  };

  // Stripe v20+ ではcurrent_period_start/endが直接プロパティとして存在しない場合がある
  const raw = subscription as unknown as Record<string, unknown>;
  const periodStart = raw.current_period_start as number | undefined;
  const periodEnd = raw.current_period_end as number | undefined;

  await supabase.from("subscriptions").upsert(
    {
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      plan: plan?.id || "premium",
      status: statusMap[subscription.status] || "active",
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : new Date().toISOString(),
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : new Date().toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "user_id" }
  );
}
