"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Subscription } from "../types";
import { CancelSubscriptionButton } from "./cancel-subscription-button";

interface SubscriptionInfoProps {
  subscription: Subscription;
}

export function SubscriptionInfo({ subscription }: SubscriptionInfoProps) {
  const getPlanName = (planType: string) => {
    switch (planType) {
      case "daily":
        return "Daily Boost";
      case "monthly":
        return "Growth Plan";
      case "lifetime":
        return "Lifetime";
      default:
        return planType;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "expired":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatAmount = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">{getPlanName(subscription.plan_type)}</h3>
            <Badge variant={getStatusColor(subscription.status)}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatAmount(subscription.amount_paid)} paid
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        {subscription.start_date && (
          <div>
            <span className="font-medium">Started:</span>{" "}
            {format(new Date(subscription.start_date), "MMM d, yyyy")}
          </div>
        )}
        {subscription.end_date ? (
          <div>
            <span className="font-medium">Ends:</span>{" "}
            {format(new Date(subscription.end_date), "MMM d, yyyy")}
          </div>
        ) : subscription.plan_type === "lifetime" ? (
          <div>
            <span className="font-medium">Ends:</span> Never (Lifetime)
          </div>
        ) : null}
      </div>

      {subscription.status === "active" && (
        <div className="pt-4 border-t">
          <CancelSubscriptionButton subscription={subscription} />
        </div>
      )}
    </Card>
  );
}

