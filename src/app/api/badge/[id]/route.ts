import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
      .from("products")
      .select("name")
      .eq("id", id)
      .single();

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
    const productUrl = `${siteUrl}/products/${id}`;

    // Generate SVG badge
    const svg = `
<svg width="140" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="140" height="32" rx="6" fill="#000"/>
  <text x="70" y="21" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#fff" text-anchor="middle" font-weight="500">Live on Saaslist</text>
</svg>`.trim();

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Badge generation error:", error);
    return new NextResponse("Error generating badge", { status: 500 });
  }
}

