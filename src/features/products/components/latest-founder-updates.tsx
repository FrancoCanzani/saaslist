import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Suspense } from "react";
import ProductLogo from "./product-logo";

interface UpdateWithProduct {
  id: string;
  title: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    logo_url?: string;
    is_featured?: boolean;
  };
}

async function LatestFounderUpdatesContent() {
  const supabase = await createClient();

  const { data: updates, error } = await supabase
    .from("product_updates")
    .select(
      `
      id,
      title,
      created_at,
      product_id,
      products!product_updates_product_id_fkey(
        id,
        name,
        logo_url,
        is_featured
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error || !updates || updates.length === 0) {
    return null;
  }

  const processedUpdates: (UpdateWithProduct & { is_featured: boolean })[] = [];
  const featuredProductIds = new Set<string>();

  updates.forEach((update: any, index: number) => {
    const product = update.products;

    if (!product) return;

    const shouldBeFeatured =
      (index + 1) % 3 === 0 &&
      !featuredProductIds.has(product.id) &&
      !product.is_featured;

    if (shouldBeFeatured) {
      featuredProductIds.add(product.id);
    }

    processedUpdates.push({
      id: update.id,
      title: update.title,
      created_at: update.created_at,
      product: {
        id: product.id,
        name: product.name,
        logo_url: product.logo_url,
        is_featured: product.is_featured || shouldBeFeatured,
      },
      is_featured: product.is_featured || shouldBeFeatured,
    });
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl leading-tight font-medium">
        Latest Founder Updates
      </h2>
      <div className="space-y-4 flex flex-col">
        {processedUpdates.map((update) => (
          <Link
            key={update.id}
            href={`/products/${update.product.id}`}
            prefetch
          >
            <Card className="flex rounded-xl bg-surface/20 border-border/50 hover:border-border transition-all duration-300 hover:bg-surface/80 group flex-col gap-3 p-3">
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 size-10 items-start justify-center">
                  <ProductLogo
                    logoUrl={update.product.logo_url}
                    productName={update.product.name}
                    size={25}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-start space-x-1.5">
                    <h3 className="font-medium text-xl">
                      {update.product.name}
                    </h3>
                    {update.is_featured && (
                      <div className="flex items-center border px-1 py-0.5 text-[10px] rounded-lg justify-start space-x-1.5">
                        <span className="font-medium text-muted-foreground">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {update.title}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LatestFounderUpdatesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-48 rounded" />
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card
            key={i}
            className="flex bg-surface/10 flex-col gap-3 py-3 px-4 h-auto min-h-[100px]"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function LatestFounderUpdates() {
  return (
    <Suspense fallback={<LatestFounderUpdatesSkeleton />}>
      <LatestFounderUpdatesContent />
    </Suspense>
  );
}
