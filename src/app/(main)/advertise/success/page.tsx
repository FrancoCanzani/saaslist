import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function AdvertiseSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let subscription = null;
  let isFutureStart = false;
  let startDate: Date | null = null;

  if (sessionId) {
    const supabase = await createClient();
    const { data: sub, error } = await supabase
      .from("subscriptions")
      .select("start_date, plan_type")
      .eq("stripe_checkout_session_id", sessionId)
      .single();

    if (!error && sub && sub.start_date) {
      startDate = new Date(sub.start_date);
      const now = new Date();
      isFutureStart = startDate > now;
      subscription = sub;
    }
  }

  return (
    <main className="p-6 space-y-12 max-w-2xl mx-auto py-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-medium tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground text-sm">
          {isFutureStart
            ? "Your subscription is confirmed and will activate on the selected date."
            : "Thank you for subscribing. Your products are now featured on Saaslist."}
        </p>
      </div>

      <div className="space-y-4 text-center">
        {isFutureStart && startDate && (
          <Alert>
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">
                  Your Daily Boost will start on {format(startDate, "MMMM d, yyyy")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Your products will automatically become featured on that date. You'll receive a confirmation email when it's active.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {!isFutureStart && (
            <p className="text-sm text-muted-foreground">
              It may take a few minutes for your products to appear as featured across the site.
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            We now track analytics for your products, which you can view on your{" "}
            <Link href="/my-products" className="underline font-medium">
              My Products
            </Link>{" "}
            page.
          </p>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button asChild variant="outline" size={"xs"}>
          <Link href="/profile">Manage Subscription</Link>
        </Button>
        <Button asChild size={"xs"}>
          <Link href="/my-products">My Products</Link>
        </Button>
      </div>
    </main>
  );
}

