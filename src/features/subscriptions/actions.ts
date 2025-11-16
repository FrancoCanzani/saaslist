"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { Subscription, SubscriptionStatus } from "./types";

export async function getUserSubscriptions(): Promise<Subscription[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("You must be logged in to view subscriptions");
    }

    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to fetch subscriptions");
    }

    return subscriptions || [];
  } catch (error) {
    console.error("Get subscriptions error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function getActiveSubscription(): Promise<Subscription | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const now = new Date().toISOString();

    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .or(`end_date.is.null,end_date.gt.${now}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // No active subscription
      }
      throw new Error("Failed to fetch subscription");
    }

    return subscription;
  } catch (error) {
    console.error("Get active subscription error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong");
  }
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "You must be logged in" };
    }

    // Verify the subscription belongs to the user
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

    // If it's a monthly subscription with Stripe subscription ID, cancel in Stripe first
    if (
      subscription.plan_type === "monthly" &&
      subscription.stripe_subscription_id
    ) {
      // TODO: Integrate with Stripe API to cancel subscription
      // For now, we'll just mark it as cancelled in the database
      // When Stripe integration is added, call:
      // await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    }

    // Update subscription status to cancelled
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

    // The trigger will automatically update the profile featured status
    revalidatePath("/profile");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Something went wrong",
    };
  }
}

