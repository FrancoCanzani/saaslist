import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ArrowUpRight, MessageSquare, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../types";
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
    .limit(5);

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
      <div>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="border-dashed border p-4 rounded-xl text-muted-foreground italic text-center text-sm">
          Ups! It looks like we have nothing to show here
        </div>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div>
        {processedProducts.map((product: Product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="duration-100 mb-2 ease-out outline-transparent not-disabled:cursor-pointer hover:not-disabled:outline-[3px] hover:not-disabled:outline-border/50 hover:not-disabled:border-ring focus-visible:outline-[3px] focus-visible:outline-border/50 focus-visible:border-ring group relative flex items-center gap-3 w-full border bg-card px-3 py-2 rounded-xl hover:bg-yellow-200">
              <div className="rounded-md w-8 flex items-center justify-center h-8 bg-gray-100 p-1">
                {product.logo_url ? (
                  <Image
                    src={product.logo_url}
                    alt={`${product.name} logo`}
                    width={20}
                    height={20}
                  />
                ) : (
                  <div className="h-9 w-9 flex items-center font-medium italic justify-center">
                    {product.name.split("")[0]}
                  </div>
                )}
              </div>
              <div className="flex-col flex flex-1 min-w-0">
                <a
                  href={product.website_url}
                  className="group group-hover:text-blue-600 inline-flex items-center gap-1 font-medium transition-colors duration-100"
                >
                  {product.name}

                  <ArrowUpRight className="opacity-0 size-3.5 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="text-sm flex items-center gap-2 min-w-0">
                  <h3 className="truncate shrink">{product.tagline}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Tags className="size-3" />
                    {product.tags
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <span
                          className="hover:underline text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                          key={index}
                        >
                          {tag}
                        </span>
                      ))}
                    {product.tags.length > 3 && (
                      <span className="text-xs">
                        +{product.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-end gap-x-2">
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  className="text-xs font-medium"
                >
                  <MessageSquare className="size-3" />
                  {product.comments_count}
                </Button>
                <UpvoteButton product={product} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
