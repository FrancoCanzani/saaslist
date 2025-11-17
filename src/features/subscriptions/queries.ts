import type { Subscription, SubscriptionStatus } from "./types";
import { createClient } from "@/lib/supabase/server";

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
