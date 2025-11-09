import EmptyGridCell from "@/features/products/components/empty-grid-cell";
import ProductGridCard from "@/features/products/components/product-grid-card";
import { Product } from "@/features/products/types";
import { categories } from "@/utils/constants";
import { getCategoryBySlug } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export const revalidate = 600;

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const categoryTagsLower = category.tags.map((tag) => tag.toLowerCase());

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      *,
      upvotes!left(user_id)
    `,
    )
    .order("created_at", { ascending: false });

  const categoryProducts = (products || [])
    .filter((product: any) => {
      if (!product.tags || !Array.isArray(product.tags)) return false;
      return product.tags.some((tag: string) =>
        categoryTagsLower.includes(tag.toLowerCase()),
      );
    })
    .map((product: any) => ({
      ...product,
      is_upvoted: user
        ? product.upvotes?.some((upvote: any) => upvote.user_id === user.id)
        : false,
    })) as Product[];

  const tagCounts = new Map<string, number>();
  category.tags.forEach((tag) => {
    const count = categoryProducts.filter((product) =>
      product.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
    ).length;
    if (count > 0) {
      tagCounts.set(tag, count);
    }
  });

  const tagsWithProducts = Array.from(tagCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  const totalProducts = categoryProducts.length;
  const gridCols = 2;
  const remainder = totalProducts % gridCols;
  const emptyCells = remainder === 0 ? 0 : gridCols - remainder;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="flex items-center w-full justify-between gap-6">
        <div>
          <h1 className="text-xl font-mono font-medium">{category.name}</h1>
          {category.description && (
            <h2 className="dark:text-muted-foreground text-gray-600 text-sm">
              {category.description}
            </h2>
          )}
        </div>

        <div className="text-xs text-gray-600 dark:text-muted-foreground">
          {categoryProducts.length}{" "}
          {categoryProducts.length === 1 ? "product" : "products"}
        </div>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="dark:text-muted-foreground text-gray-600 text-sm">
            No products in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 border rounded">
          {categoryProducts.map((product, index) => (
            <ProductGridCard
              key={product.id}
              product={product}
              index={index}
              totalProducts={categoryProducts.length}
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
