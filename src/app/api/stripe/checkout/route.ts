import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { priceId } = await request.json();
  if (!priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("stripe_customer_id, company_name")
    .eq("id", currentUser.authUser.id)
    .single();

  let customerId = user?.stripe_customer_id;

  // Stripeカスタマーが未作成の場合は作成
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: currentUser.authUser.email,
      name: user?.company_name || undefined,
      metadata: { userId: currentUser.authUser.id },
    });
    customerId = customer.id;

    await supabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", currentUser.authUser.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/settings/billing?success=true`,
    cancel_url: `${appUrl}/settings/billing?canceled=true`,
    metadata: { userId: currentUser.authUser.id },
  });

  return NextResponse.json({ url: session.url });
}
