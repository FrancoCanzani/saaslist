import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import { Product } from "../types";
import ProductGrid from "./product-grid";

export default async function ProductList({
  date,
}: {
  date: "today" | "yesterday" | "week" | "month";
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();

  const dates = new Map([
    ["today", new Date(now.getFullYear(), now.getMonth(), now.getDate())],
    ["yesterday", new Date(now.getTime() - 24 * 60 * 60 * 1000)],
    ["week", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)],
    ["month", new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())],
  ]);

  const titles = new Map([
    ["today", "Today's Top Products"],
    ["yesterday", "Yesterday's Top Products"],
    ["week", "This Week's Top Products"],
    ["month", "This Month's Top Products"],
  ]);

  const startDate = dates.get(date) || dates.get("today")!;
  const title = titles.get(date) || titles.get("today")!;

  let query = supabase.from("products").select(`
      *,
      likes!left(user_id)
    `);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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
    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    query = query
      .gte("created_at", monthAgo.toISOString())
      .lt("created_at", today.toISOString());
  } else {
    query = query.gte("created_at", startDate.toISOString());
  }

  const { data: products, error } = await query
    .order("likes_count", { ascending: false })
    .limit(10);

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

  if (error) {
    return (
      <div>
        <div>Error loading products</div>
      </div>
    );
  }

  if (!processedProducts || processedProducts.length == 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl leading-tight font-medium">{title}</h2>
        <Alert>
          <AlertDescription className="mx-auto">
            Ups! It looks like we have nothing to show here{" "}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl leading-tight font-medium">{title}</h2>
      <ProductGrid products={processedProducts} />
    </div>
  );
}
