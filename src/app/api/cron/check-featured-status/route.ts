import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent");
  const isVercelCron = userAgent?.includes("vercel-cron");
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isVercelCron && !cronSecret) {
    console.warn("⚠️ Request not from Vercel cron - allowing for local testing");
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    console.log("🔄 Cancelling expired subscriptions...");
    const { error: cancelError } = await supabase
      .from("subscriptions")
      .update({ status: "cancelled", updated_at: now })
      .eq("status", "active")
      .not("end_date", "is", null)
      .lt("end_date", now);

    if (cancelError) {
      console.error("❌ Error cancelling expired subscriptions:", cancelError);
    }

    console.log("🔄 Unfeaturing expired profiles...");
    const { data: expiredProfiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id")
      .eq("is_featured", true)
      .not("featured_until", "is", null)
      .lt("featured_until", now);

    if (profilesError) {
      console.error("❌ Error finding expired profiles:", profilesError);
    } else if (expiredProfiles && expiredProfiles.length > 0) {
      for (const profile of expiredProfiles) {
        const { data: activeSubs } = await supabase
          .from("subscriptions")
          .select("id, start_date, end_date")
          .eq("user_id", profile.id)
          .eq("status", "active")
          .limit(10);

        const hasActive = activeSubs?.some(
          (sub) =>
            (sub.start_date === null || sub.start_date <= now) &&
            (sub.end_date === null || sub.end_date > now)
        );

        if (!hasActive) {
          const { error: unfeatureError } = await supabase
            .from("profiles")
            .update({ is_featured: false, featured_until: null, updated_at: now })
            .eq("id", profile.id);

          if (unfeatureError) {
            console.error(`❌ Error unfeaturing profile ${profile.id}:`, unfeatureError);
          }
        }
      }
    }

    console.log("🔄 Unfeaturing expired products...");
    const { error: productsError } = await supabase
      .from("products")
      .update({ is_featured: false, featured_until: null, updated_at: now })
      .eq("is_featured", true)
      .not("featured_until", "is", null)
      .lt("featured_until", now);

    if (productsError) {
      console.error("❌ Error unfeaturing expired products:", productsError);
    }

    console.log("🔄 Activating subscriptions with start_date...");
    const { data: pendingSubscriptions, error: pendingError } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("status", "active")
      .not("start_date", "is", null)
      .lte("start_date", now);

    if (pendingError) {
      console.error("❌ Error checking pending subscriptions:", pendingError);
    } else if (pendingSubscriptions && pendingSubscriptions.length > 0) {
      console.log(`📋 Activating ${pendingSubscriptions.length} subscription(s)`);

      for (const sub of pendingSubscriptions) {
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({ updated_at: now })
          .eq("id", sub.id);

        if (updateError) {
          console.error(`❌ Error activating subscription ${sub.id}:`, updateError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Featured status check completed",
      timestamp: now,
    });
  } catch (error) {
    console.error("❌ Cron job error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

