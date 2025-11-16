import { ProfileForm } from "@/features/profiles/components/profile-form";
import { getCurrentUser } from "@/features/profiles/api";
import { getActiveSubscription, getUserSubscriptions } from "@/features/subscriptions/actions";
import { SubscriptionInfo } from "@/features/subscriptions/components/subscription-info";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [activeSubscription, allSubscriptions] = await Promise.all([
    getActiveSubscription(),
    getUserSubscriptions(),
  ]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-medium">My Profile</h1>
        <h2 className="text-muted-foreground text-sm">
          Manage your profile information
        </h2>
      </div>

      <div className="max-w-2xl space-y-8">
        <ProfileForm profile={profile} userEmail={user.email || ""} />

        {activeSubscription && (
          <div className="pt-8 border-t space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-4">Active Subscription</h3>
              <SubscriptionInfo subscription={activeSubscription} />
            </div>
          </div>
        )}

        {allSubscriptions.length > 0 && (
          <div className="pt-8 border-t space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-4">Subscription History</h3>
              <div className="space-y-4">
                {allSubscriptions.map((subscription) => (
                  <SubscriptionInfo key={subscription.id} subscription={subscription} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 border-t space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Account Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">User ID:</span> {user.id}
              </div>
              <div>
                <span className="font-medium">Account Created:</span>{" "}
                {format(new Date(user.created_at), "MMM d, yyyy")}
              </div>
              {profile?.is_featured && (
                <div>
                  <span className="font-medium">Featured Status:</span>{" "}
                  <span className="text-green-600 dark:text-green-400">Active</span>
                  {profile.featured_until && (
                    <span className="ml-2">
                      (until {format(new Date(profile.featured_until), "MMM d, yyyy")})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
