export type PlanType = "daily" | "monthly" | "lifetime";
export type SubscriptionStatus = "pending" | "active" | "expired" | "cancelled";

export interface Subscription {
  id: string;
  product_id: string;
  user_id: string;
  plan_type: PlanType;
  stripe_checkout_session_id: string | null;
  stripe_subscription_id: string | null;
  stripe_payment_intent_id: string | null;
  status: SubscriptionStatus;
  start_date: string | null;
  end_date: string | null;
  amount_paid: number; // Amount in cents
  created_at: string;
  updated_at: string;
}

