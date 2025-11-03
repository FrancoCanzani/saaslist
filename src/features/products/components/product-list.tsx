import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { MessageSquare, Tags } from "lucide-react";
import Link from "next/link";
import { Product } from "../types";
import ProductLogo from "./product-logo";
import UpvoteButton from "./upvote-button";

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
  return (
    <div className="space-y-6">
      <h2 className="text-xl leading-tight font-medium">{title}</h2>
      <div className="flex flex-col space-y-6">
        {processedProducts.map((product: Product, index) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="group relative flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50">
              <div className="rounded-md size-8 flex items-center justify-center bg-gray-50 p-1">
                <ProductLogo
                  logoUrl={product.logo_url}
                  productName={product.name}
                  size={25}
                />
              </div>
              <div className="flex-col flex flex-1 min-w-0">
                <h2 className="group group-hover:text-blue-800 inline-flex items-center gap-1 font-medium transition-colors duration-100">
                  {index + 1}. {product.name}
                </h2>
                <div className="flex items-center gap-2 w-full min-w-0 overflow-hidden">
                  <h3 className="text-sm text-muted-foreground whitespace-nowrap shrink">
                    {product.tagline}
                  </h3>
                  <div className="hidden md:flex items-center gap-2">
                    <Tags className="size-3 shrink-0" />
                    {product.tags
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <span
                          className="hover:underline text-xs bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0"
                          key={index}
                        >
                          {tag}
                        </span>
                      ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs whitespace-nowrap shrink-0">
                        +{product.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-2 shrink-0">
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  className="text-xs hidden md:flex font-medium"
                >
                  <MessageSquare className="size-3" />
                  {product.comments_count}
                </Button>
                <UpvoteButton size={"sm"} product={product} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
