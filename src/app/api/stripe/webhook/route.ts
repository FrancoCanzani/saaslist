import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("No signature found in headers");
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log(`✅ Webhook verified: ${event.type}`);
    } catch (err) {
      const error = err as Error;
      console.error(`❌ Webhook signature verification failed: ${error.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(supabase, paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  supabase: any,
  session: Stripe.Checkout.Session
) {
  console.log("Processing checkout.session.completed", session.id);
  
  const metadata = session.metadata;
  if (!metadata) {
    console.error("No metadata in checkout session");
    return;
  }

  const userId = metadata.user_id;
  const planType = metadata.plan_type;

  let startDate: string | null = new Date().toISOString();
  let endDate: string | null = null;

  if (planType === "daily" && metadata.start_date && metadata.end_date) {
    startDate = metadata.start_date;
    endDate = metadata.end_date;
  }

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  const subscriptionData: any = {
    status: "active",
    start_date: startDate,
    end_date: endDate,
    stripe_payment_intent_id: session.payment_intent as string | null,
    updated_at: new Date().toISOString(),
  };

  if (session.subscription) {
    subscriptionData.stripe_subscription_id = session.subscription as string;
  }

  if (existingSubscription) {
    const { error } = await supabase
      .from("subscriptions")
      .update(subscriptionData)
      .eq("id", existingSubscription.id);
    
    if (error) console.error("Error updating subscription:", error);
    else console.log("✅ Subscription updated:", existingSubscription.id);
  } else {
    const { error } = await supabase.from("subscriptions").insert({
      user_id: userId,
      plan_type: planType,
      stripe_checkout_session_id: session.id,
      stripe_subscription_id: session.subscription as string | null,
      stripe_payment_intent_id: session.payment_intent as string | null,
      status: "active",
      start_date: startDate,
      end_date: endDate,
      amount_paid: session.amount_total || 0,
    });
    
    if (error) console.error("Error creating subscription:", error);
    else console.log("✅ Subscription created");
  }
}

async function handleSubscriptionUpdated(
  supabase: any,
  subscription: Stripe.Subscription
) {
  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!existingSubscription) {
    console.error("Subscription not found in database");
    return;
  }

  const status = subscription.status === "active" ? "active" : "cancelled";
  const currentPeriodEnd = (subscription as any).current_period_end
    ? new Date((subscription as any).current_period_end * 1000).toISOString()
    : null;

  await supabase
    .from("subscriptions")
    .update({
      status,
      end_date: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingSubscription.id);
}

async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription
) {
  await supabase
    .from("subscriptions")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);
}

async function handlePaymentSucceeded(
  supabase: any,
  paymentIntent: Stripe.PaymentIntent
) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (subscription && subscription.status === "pending") {
    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);
  }
}