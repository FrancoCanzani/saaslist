import { format } from "date-fns";
import { Subscription } from "../types";
import { CancelSubscriptionButton } from "./cancel-subscription-button";
import { getPlanName } from "../helpers";

export function SubscriptionInfo({
  subscription,
}: {
  subscription: Subscription;
}) {
  return (
    <div className="w-full flex items-start justify-between">
      <div className="flex items-start flex-col gap-y-1.5 justify-between">
        <h3 className="font-medium">{getPlanName(subscription.plan_type)}</h3>

        <div className="space-y-2 text-muted-foreground text-xs">
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
      </div>

      {subscription.status === "active" && (
        <CancelSubscriptionButton subscription={subscription} />
      )}
    </div>
  );
}
