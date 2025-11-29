import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getLoginUrl } from "@/utils/helpers";
import { AnalyticsDashboard } from "@/features/products/components/analytics-dashboard";
import { getProductsAnalytics } from "@/features/products/api/get-products-analytics";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Analytics | SaasList",
  description:
    "View detailed analytics for your products. Track views, geographic distribution, and trends.",
  alternates: {
    canonical: `${baseUrl}/my-products/analytics`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(getLoginUrl("/my-products/analytics"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_featured, featured_until")
    .eq("id", user.id)
    .single();

  const isFeatured =
    profile?.is_featured &&
    (!profile.featured_until || new Date(profile.featured_until) > new Date());

  if (!isFeatured) {
    redirect("/advertise");
  }

  const analyticsData = await getProductsAnalytics(user.id);

  if (!analyticsData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
        <div>
          <h1 className="text-xl font-medium">Analytics</h1>
          <p className="text-muted-foreground text-sm">
            Track your product performance
          </p>
        </div>
        <Alert>
          <AlertDescription>
            You need at least one product to view analytics.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-8">
      <div>
        <h1 className="text-xl font-medium">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Track your product performance and audience insights
        </p>
      </div>

      <AnalyticsDashboard data={analyticsData} />
    </div>
  );
}
