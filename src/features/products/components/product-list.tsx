import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/server";
import { Product } from "../types";
import EmptyGridCell from "./empty-grid-cell";
import ProductGridCard from "./product-grid-card";

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
      upvotes!left(user_id)
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
    .order("upvotes_count", { ascending: false })
    .limit(10);

  const processedProducts =
    products?.map((product) => ({
      ...product,
      is_upvoted: user
        ? product.upvotes?.some((upvote: any) => upvote.user_id === user.id)
        : false,
    })) || [];

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
        <h2 className="text-xl font-semibold">{title}</h2>
        <Alert>
          <AlertDescription className="mx-auto">
            Ups! It looks like we have nothing to show here{" "}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalProducts = processedProducts.length;
  const gridCols = 2;
  const remainder = totalProducts % gridCols;
  const emptyCells = remainder === 0 ? 0 : gridCols - remainder;

  return (
    <div className="space-y-6">
      <h2 className="text-xl leading-tight font-mono font-medium">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 border rounded">
        {processedProducts.map((product: Product, index: number) => (
          <ProductGridCard
            key={product.id}
            product={product}
            index={index}
            totalProducts={processedProducts.length}
          />
        ))}

        {Array.from({ length: emptyCells }).map((_, index) => (
          <EmptyGridCell
            key={`empty-${index}`}
            index={index}
            cellIndex={totalProducts + index}
            totalCells={totalProducts + emptyCells}
          />
        ))}
      </div>
    </div>
  );
}
