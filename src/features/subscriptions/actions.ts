"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { revalidatePath } from "next/cache";

export async function cancelSubscription(
  subscriptionId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("user_id, stripe_subscription_id, plan_type, status")
      .eq("id", subscriptionId)
      .single();

    if (fetchError || !subscription) {
      return { success: false, error: "Subscription not found" };
    }

    if (subscription.user_id !== user.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (subscription.status !== "active") {
      return { success: false, error: "Subscription is not active" };
    }

    if (
      subscription.plan_type === "monthly" &&
      subscription.stripe_subscription_id
    ) {
      try {
        await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
      } catch (error) {
        console.error("Failed to cancel Stripe subscription:", error);
      }
    }

    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId);

    if (updateError) {
      return { success: false, error: "Failed to cancel subscription" };
    }

    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
}
