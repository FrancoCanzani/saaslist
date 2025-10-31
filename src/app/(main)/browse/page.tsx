import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductTags } from "@/features/browse/api";
import { tags } from "@/utils/constants";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 600;

export default async function BrowsePage() {
  const products = await getProductTags();

  const categoryStats = tags.map((category) => {
    const count =
      products?.filter((product) =>
        product.tags.some((tag: string) =>
          category.tags.some(
            (catTag) => catTag.toLowerCase() === tag.toLowerCase(),
          ),
        ),
      ).length || 0;

    return {
      name: category.name,
      count,
      tags: category.tags,
    };
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-xl font-medium">Browse Products</h1>
        <p className="text-muted-foreground text-sm">
          Explore products by category
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryStats.map((category) => (
          <Link
            key={category.name}
            href={`/browse/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <Card className="group rounded-lg">
              <CardHeader className="w-full">
                <CardTitle className="w-full flex items-center justify-start gap-x-1">
                  {category.name}
                  <span>({category.count})</span>
                  <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-secondary group-hover:bg-card px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
