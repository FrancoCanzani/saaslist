import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
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

type PartialProduct = {
  id: string;
  name: string;
  logo_url?: string | null;
  is_featured?: boolean | null;
};

type SupabaseUpdate = {
  id: string;
  title: string;
  created_at: string;
  product_id: string;
  products: PartialProduct | null;
};

export default async function LatestProductUpdates() {
  const supabase = await createClient();

  const { data: updates, error: updatesError } = await supabase
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

  const processedUpdates: (UpdateWithProduct & { is_featured: boolean })[] = [];
  const featuredProductIds = new Set<string>();

  if (updates && !updatesError) {
    (updates as unknown as SupabaseUpdate[]).forEach((update, index: number) => {
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
          logo_url: product.logo_url ?? undefined,
          is_featured: product.is_featured || shouldBeFeatured,
        },
        is_featured: product.is_featured || shouldBeFeatured,
      });
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl leading-tight font-medium">
        Latest Product Updates
      </h2>
      {processedUpdates.length > 0 ? (
        <div className="space-y-4 flex flex-col">
          {processedUpdates.map((update) => (
            <Link
              key={update.id}
              href={`/products/${update.product.id}`}
              prefetch
            >
              <Card className="flex rounded-xl bg-surface/20 border-border/50 hover:border-border transition-all duration-300 hover:bg-surface/80 group flex-col gap-3 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-start space-x-1.5">
                    <div className="flex items-center justify-center space-x-1.5">
                      <ProductLogo
                        logoUrl={update.product.logo_url}
                        productName={update.product.name}
                        size={15}
                      />
                      <h3 className="font-medium text-sm">
                        {update.product.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNowStrict(new Date(update.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-1">{update.title}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No updates available at the moment.
        </div>
      )}
    </div>
  );
}
