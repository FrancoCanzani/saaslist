import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 10;
const FEATURED_INTERVAL = 2; // Insert featured product after every 2 normal products

interface DiscoverItem {
  type: "normal" | "featured";
  id: string;
  name: string;
  tagline: string | null;
  logo_url: string | null;
  images: string[] | null;
  is_featured: boolean | null;
  user_id: string;
  created_at: string;
  [key: string]: unknown;
}

interface DiscoverResponse {
  items: DiscoverItem[];
  nextPage: number | null;
  hasMore: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const seenIds = searchParams.get("seen")?.split(",").filter(Boolean) || [];

    let userLikedIds: string[] = [];
    let userOwnedIds: string[] = [];

    if (user) {
      const { data: likes } = await supabase
        .from("likes")
        .select("product_id")
        .eq("user_id", user.id);

      userLikedIds = likes?.map((like) => like.product_id) || [];

      const { data: owned } = await supabase
        .from("products")
        .select("id")
        .eq("user_id", user.id);

      userOwnedIds = owned?.map((p) => p.id) || [];
    }

    // Combine all excluded IDs
    const excludedIds = [
      ...userLikedIds,
      ...userOwnedIds,
      ...seenIds,
    ].filter(Boolean);

    
    const { data: allProducts, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000); 

    if (productsError) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const excludedSet = new Set(excludedIds);

    const normalProducts = (allProducts || [])
      .filter((p) => !excludedSet.has(p.id) && !p.is_featured)
      .slice(0, 500) as DiscoverItem[]; // Limit for performance

    const featuredProducts = (allProducts || [])
      .filter((p) => !excludedSet.has(p.id) && p.is_featured === true)
      .slice(0, 100) as DiscoverItem[]; // Limit featured products

    const offset = (page - 1) * ITEMS_PER_PAGE;
    const paginatedNormal = normalProducts.slice(offset, offset + ITEMS_PER_PAGE);

    const items: DiscoverItem[] = [];
    let featuredIndex = 0;
    const usedFeaturedIds = new Set<string>();

    for (let i = 0; i < paginatedNormal.length; i++) {
      items.push({
        ...paginatedNormal[i],
        type: "normal",
      });

      if ((i + 1) % FEATURED_INTERVAL === 0) {
        while (
          featuredIndex < featuredProducts.length &&
          usedFeaturedIds.has(featuredProducts[featuredIndex].id)
        ) {
          featuredIndex++;
        }

        if (featuredIndex < featuredProducts.length) {
          const featuredProduct = featuredProducts[featuredIndex];
          items.push({
            ...featuredProduct,
            type: "featured",
          });
          usedFeaturedIds.add(featuredProduct.id);
          featuredIndex++;
        }
      }
    }

    const totalNormal = normalProducts.length;
    const hasMore = offset + ITEMS_PER_PAGE < totalNormal;
    const nextPage = hasMore ? page + 1 : null;

    const response: DiscoverResponse = {
      items,
      nextPage,
      hasMore,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Discover API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

