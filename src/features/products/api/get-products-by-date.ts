import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { Product } from "../types";

type DateFilter = "today" | "yesterday" | "week" | "month";

export const getProductsByDate = cache(
  async (date: DateFilter): Promise<{ products: Product[]; title: string }> => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const titles: Record<DateFilter, string> = {
      today: "Today's Top Products",
      yesterday: "Yesterday's Top Products",
      week: "This Week's Top Products",
      month: "This Month's Top Products",
    };

    let query = supabase.from("products").select(`
      *,
      likes!left(user_id)
    `);

    if (date === "yesterday") {
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      query = query
        .gte("created_at", yesterday.toISOString())
        .lt("created_at", today.toISOString());
    } else if (date === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query = query
        .gte("created_at", weekAgo.toISOString())
        .lt("created_at", today.toISOString());
    } else if (date === "month") {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      query = query
        .gte("created_at", monthAgo.toISOString())
        .lt("created_at", today.toISOString());
    } else {
      query = query.gte("created_at", today.toISOString());
    }

    const { data: products, error } = await query
      .order("is_featured", { ascending: false })
      .order("likes_count", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching products:", error);
      return { products: [], title: titles[date] };
    }

    const processedProducts: Product[] =
      products?.map((product) => {
        const { likes, likes_count, ...rest } = product as Product & {
          likes?: { user_id: string }[];
          likes_count: number;
        };

        return {
          ...rest,
          likes_count,
          is_liked: user
            ? (likes?.some((like) => like.user_id === user.id) ?? false)
            : false,
        };
      }) || [];

    return { products: processedProducts, title: titles[date] };
  }
);

