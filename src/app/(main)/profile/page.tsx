import { ProfileForm } from "@/features/profiles/components/profile-form";
import { getCurrentUser } from "@/features/profiles/api";
import { getActiveSubscription } from "@/features/subscriptions/queries";
import { SubscriptionInfo } from "@/features/subscriptions/components/subscription-info";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "My Profile | SaasList",
  description: "Manage your profile information, subscriptions, and account settings on SaasList.",
  alternates: {
    canonical: `${baseUrl}/profile`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const activeSubscription = await getActiveSubscription();

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
