import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planType, dateRange } = body;

    if (!["daily", "monthly", "lifetime"].includes(planType)) {
      return NextResponse.json(
        { error: "Invalid plan type" },
        { status: 400 }
      );
    }

    let amount = 0;
    let description = "";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (planType === "daily") {
      if (!dateRange?.from || !dateRange?.to) {
        return NextResponse.json(
          { error: "Date range is required for daily plan" },
          { status: 400 }
        );
      }
      const startDate = new Date(dateRange.from);
      const endDate = new Date(dateRange.to);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      amount = days * 500; // $5 per day in cents
      description = `Daily Boost - ${days} day${days > 1 ? "s" : ""}`;
    } else if (planType === "monthly") {
      amount = 1900; // $19 per month in cents
      description = "Growth Plan - Monthly";
    } else if (planType === "lifetime") {
      amount = 99900; // $999 in cents
      description = "Lifetime Plan";
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: planType === "monthly" ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: description,
            },
            unit_amount: amount,
            ...(planType === "monthly" && {
              recurring: {
                interval: "month",
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/advertise?canceled=true`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        ...(planType === "daily" && dateRange && {
          start_date: new Date(dateRange.from).toISOString(),
          end_date: new Date(dateRange.to).toISOString(),
        }),
      },
      customer_email: user.email || undefined,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    interface SubscriptionInsertData {
      user_id: string;
      plan_type: "daily" | "monthly" | "lifetime";
      stripe_checkout_session_id: string;
      status: "pending";
      amount_paid: number;
      start_date?: string;
      end_date?: string;
    }

    const subscriptionData: SubscriptionInsertData = {
      user_id: user.id,
      plan_type: planType as "daily" | "monthly" | "lifetime",
      stripe_checkout_session_id: session.id,
      status: "pending",
      amount_paid: amount,
      ...(planType === "daily" && dateRange && {
        start_date: new Date(dateRange.from).toISOString(),
        end_date: new Date(dateRange.to).toISOString(),
      }),
    };

    const { error: insertError } = await supabase
      .from("subscriptions")
      .insert(subscriptionData);

    if (insertError) {
      console.error("Failed to create subscription record:", insertError);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

