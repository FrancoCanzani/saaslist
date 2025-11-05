import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight } from "lucide-react";
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedProducts.map((product: Product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="group flex bg-gray-50/50 flex-col h-full space-y-2 border-none">
              <div className="flex items-start gap-2">
                <div className="rounded-md size-10 flex items-center justify-center shrink-0">
                  <ProductLogo
                    logoUrl={product.logo_url}
                    productName={product.name}
                    size={30}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium line-clamp-1">{product.name}</h2>
                  <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                    {product.tagline}
                  </p>
                </div>
              </div>

              <p className="text-sm flex-1">{product.description}</p>

              <div className="flex items-center justify-between gap-2 w-full">
                {product.tags.length > 0 && (
                  <div className="flex group-hover:hidden items-center gap-1 flex-1 min-w-0 overflow-hidden">
                    {product.tags
                      .slice(0, 3)
                      .map((tag: string, index: number) => {
                        const isLast = index === Math.min(product.tags.length, 3) - 1;
                        return (
                          <span
                            className={`text-xs bg-orange-50 px-1.5 py-0.5 rounded capitalize inline-block whitespace-nowrap ${isLast ? "overflow-hidden text-ellipsis max-w-[100px]" : "shrink-0"}`}
                            key={index}
                            title={isLast ? tag : undefined}
                          >
                            {tag}
                          </span>
                        );
                      })}
                    {product.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground shrink-0">
                        +{product.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="hidden group-hover:flex text-xs capitalize font-medium items-center text-blue-700 justify-center gap-x-1 overflow-hidden">
                  Visit website
                  <ArrowRight className="size-3" />
                </div>

                <UpvoteButton size={"xs"} product={product} label="Upvote" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
