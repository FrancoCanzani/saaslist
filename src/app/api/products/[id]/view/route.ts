import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const geo = geolocation(request);


    const { error } = await supabase.from("product_views").insert({
        product_id: id,
        country: geo.country || null,
        city: geo.city || null,
        region: geo.region || null,
      });

      if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });

  }
}

