import { format } from "date-fns";
import { Subscription } from "../types";
import { CancelSubscriptionButton } from "./cancel-subscription-button";
import { getPlanName } from "../helpers";
import { Badge } from "@/components/ui/badge";

export function SubscriptionInfo({
  subscription,
}: {
  subscription: Subscription;
}) {
  const now = new Date();
  const startDate = subscription.start_date ? new Date(subscription.start_date) : null;
  const isFutureStart = startDate && startDate > now;
  const isActive = subscription.status === "active" && !isFutureStart;

  return (
    <div className="w-full flex items-start justify-between">
      <div className="flex items-start flex-col gap-y-1.5 justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{getPlanName(subscription.plan_type)}</h3>
          {isFutureStart && (
            <Badge variant="secondary" className="text-xs">
              Starts {format(startDate!, "MMM d")}
            </Badge>
          )}
          {!isActive && subscription.status === "active" && isFutureStart && (
            <Badge variant="outline" className="text-xs">
              Pending
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-muted-foreground text-xs">
          {subscription.start_date && (
            <div>
              <span className="font-medium">
                {isFutureStart ? "Starts:" : "Started:"}
              </span>{" "}
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
          {isFutureStart && (
            <div className="text-muted-foreground/80 italic">
              Your products will become featured when the subscription starts.
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <CancelSubscriptionButton subscription={subscription} />
      )}
    </div>
  );
}
