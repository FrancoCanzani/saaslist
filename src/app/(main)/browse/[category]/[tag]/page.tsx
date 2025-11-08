import EmptyGridCell from "@/features/products/components/empty-grid-cell";
import ProductGridCard from "@/features/products/components/product-grid-card";
import { Product } from "@/features/products/types";
import { categories } from "@/utils/constants";
import { getCategoryBySlug, getTagSlug } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 600;

export async function generateStaticParams() {
  const params: { category: string; tag: string }[] = [];

  categories.forEach((category) => {
    category.tags.forEach((tag) => {
      params.push({
        category: category.slug,
        tag: getTagSlug(tag),
      });
    });
  });

  return params;
}

export default async function CategoryTagPage({
  params,
}: {
  params: Promise<{ category: string; tag: string }>;
}) {
  const { category: categorySlug, tag: tagSlug } = await params;

  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const tag = category.tags.find((t) => getTagSlug(t) === tagSlug);

  if (!tag) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products, error } = await supabase
    .from("products")
    .select()
    .contains("tags", [tag])
    .order("created_at", { ascending: false });

  const processedProducts = (products || []).map((product: any) => ({
    ...product,
    is_upvoted: user
      ? product.upvotes?.some((upvote: any) => upvote.user_id === user.id)
      : false,
  })) as Product[];

  const totalProducts = processedProducts.length;
  const gridCols = 2;
  const remainder = totalProducts % gridCols;
  const emptyCells = remainder === 0 ? 0 : gridCols - remainder;

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center w-full justify-between gap-6">
        <div>
          <h1 className="text-xl font-mono font-medium">
            {category.name} / {tag}
          </h1>
        </div>

        <div className="text-xs text-gray-600 dark:text-muted-foreground">
          {processedProducts.length}{" "}
          {processedProducts.length === 1 ? "product" : "products"}
        </div>
      </div>

      {processedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="dark:text-muted-foreground text-gray-600 text-sm">
            No products found with this tag yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 border rounded">
          {processedProducts.map((product, index) => (
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
      )}
    </div>
  );
}
