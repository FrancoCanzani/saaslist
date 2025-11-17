import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [] });
    }

    const supabase = await createClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !products) {
      return NextResponse.json({ products: [] });
    }

    const fuse = new Fuse(products, {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "tagline", weight: 0.3 },
        { name: "description", weight: 0.1 },
        { name: "tags", weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 1,
    });

    const results = fuse.search(query.trim());
    const matchedProducts = results.map((result) => result.item).slice(0, 10);

    return NextResponse.json({ products: matchedProducts });
  } catch (error) {
    return NextResponse.json({ products: [] });
  }
}

