"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cancelSubscription } from "../actions";
import { Subscription } from "../types";

interface CancelSubscriptionButtonProps {
  subscription: Subscription;
}

export function CancelSubscriptionButton({
  subscription,
}: CancelSubscriptionButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelSubscription(subscription.id);
      if (result.success) {
        toast.success("Subscription cancelled successfully");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to cancel subscription");
      }
    });
  };

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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          Cancel Subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your {getPlanName(subscription.plan_type)} subscription?
            {subscription.plan_type === "monthly" && (
              <span className="block mt-2">
                Your subscription will remain active until the end of the current billing period.
              </span>
            )}
            {subscription.plan_type === "lifetime" && (
              <span className="block mt-2 text-destructive">
                This will permanently cancel your lifetime subscription. This action cannot be undone.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Cancelling..." : "Yes, Cancel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

