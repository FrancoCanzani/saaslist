import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed." },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(supabase, session);
      break;
    }

    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(supabase, session);
      break;
    }

    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutFailed(supabase, session);
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

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(supabase, paymentIntent);
      break;
    }

    // Invoice events for recurring subscription payments
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaid(supabase, invoice);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handleInvoicePaymentFailed(supabase, invoice);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(
  supabase: any,
  session: Stripe.Checkout.Session,
) {
  console.log("Processing checkout.session.completed", session.id);

  if (session.payment_status !== "paid") {
    console.log("Payment not completed, status:", session.payment_status);
    return;
  }

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

async function handleCheckoutFailed(
  supabase: any,
  session: Stripe.Checkout.Session,
) {
  console.log("Processing checkout.session.async_payment_failed", session.id);

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .single();

  if (subscription) {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    if (error) {
      console.error("Error updating failed subscription:", error);
    } else {
      console.log("❌ Subscription marked as cancelled due to payment failure");
    }
  }
}

async function handleSubscriptionUpdated(
  supabase: any,
  subscription: Stripe.Subscription,
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

  // Map Stripe subscription statuses to our internal statuses
  // Stripe statuses: incomplete, incomplete_expired, trialing, active, past_due, canceled, unpaid, paused
  const mapStripeStatus = (stripeStatus: string): "active" | "cancelled" | "pending" => {
    switch (stripeStatus) {
      case "active":
      case "trialing":
        return "active";
      case "past_due":
        // Keep active while Stripe retries payment
        return "active";
      case "incomplete":
        // Payment not yet completed
        return "pending";
      case "canceled":
      case "unpaid":
      case "incomplete_expired":
      case "paused":
        return "cancelled";
      default:
        console.log(`Unknown Stripe subscription status: ${stripeStatus}`);
        return "cancelled";
    }
  };

  const status = mapStripeStatus(subscription.status);
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

  console.log(`📝 Subscription ${existingSubscription.id} updated: Stripe status "${subscription.status}" → internal status "${status}"`);
}

async function handleSubscriptionDeleted(
  supabase: any,
  subscription: Stripe.Subscription,
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
  paymentIntent: Stripe.PaymentIntent,
) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (subscription && subscription.status === "pending") {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    if (error) {
      console.error("Error updating subscription on payment success:", error);
    } else {
      console.log("✅ Subscription activated after payment success");
    }
  }
}

async function handlePaymentFailed(
  supabase: any,
  paymentIntent: Stripe.PaymentIntent,
) {
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (subscription && subscription.status === "pending") {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id);

    if (error) {
      console.error("Error updating subscription on payment failure:", error);
    } else {
      console.log("❌ Subscription cancelled due to payment failure");
    }
  }
}

// Invoice handlers for recurring subscription payments (monthly plans)
async function handleInvoicePaid(supabase: any, invoice: Stripe.Invoice) {
  // Get subscription ID from the invoice (handle different API versions)
  const invoiceData = invoice as any;
  const subscriptionId = invoiceData.subscription || invoiceData.subscription_id;
  
  // Skip if not a subscription invoice
  if (!subscriptionId) {
    console.log("Invoice is not for a subscription, skipping");
    return;
  }

  const stripeSubscriptionId =
    typeof subscriptionId === "string"
      ? subscriptionId
      : subscriptionId.id;

  console.log("Processing invoice.paid for subscription:", stripeSubscriptionId);

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .single();

  if (!existingSubscription) {
    console.log("No subscription found for stripe_subscription_id:", stripeSubscriptionId);
    return;
  }

  // Update subscription to active and extend the end_date
  const periodEnd = invoiceData.lines?.data?.[0]?.period?.end;
  const endDate = periodEnd
    ? new Date(periodEnd * 1000).toISOString()
    : null;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      end_date: endDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existingSubscription.id);

  if (error) {
    console.error("Error updating subscription on invoice.paid:", error);
  } else {
    console.log("✅ Subscription renewed via invoice.paid:", existingSubscription.id);
  }
}

async function handleInvoicePaymentFailed(
  supabase: any,
  invoice: Stripe.Invoice,
) {
  // Get subscription ID from the invoice (handle different API versions)
  const invoiceData = invoice as any;
  const subscriptionId = invoiceData.subscription || invoiceData.subscription_id;
  
  // Skip if not a subscription invoice
  if (!subscriptionId) {
    console.log("Invoice is not for a subscription, skipping");
    return;
  }

  const stripeSubscriptionId =
    typeof subscriptionId === "string"
      ? subscriptionId
      : subscriptionId.id;

  console.log("Processing invoice.payment_failed for subscription:", stripeSubscriptionId);

  const { data: existingSubscription } = await supabase
    .from("subscriptions")
    .select("id, status")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .single();

  if (!existingSubscription) {
    console.log("No subscription found for stripe_subscription_id:", stripeSubscriptionId);
    return;
  }

  // Check the attempt count to decide whether to cancel or just log
  const attemptCount = invoiceData.attempt_count || 0;

  if (attemptCount >= 3) {
    // After 3 failed attempts, mark as cancelled
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingSubscription.id);

    if (error) {
      console.error("Error cancelling subscription on invoice.payment_failed:", error);
    } else {
      console.log("❌ Subscription cancelled after failed payment attempts:", existingSubscription.id);
    }
  } else {
    // Log the failure but keep subscription active (Stripe will retry)
    console.log(
      `⚠️ Invoice payment failed (attempt ${attemptCount}/3) for subscription:`,
      existingSubscription.id,
    );
  }
}
