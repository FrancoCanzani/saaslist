"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/utils/constants";
import { getTagSlug } from "@/utils/helpers";
import Fuse from "fuse.js";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

interface BrowseContentProps {
  products: { id: string; tags: string[] }[];
}

export function BrowseContent({ products }: BrowseContentProps) {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  const categoryStats = useMemo(() => {
    return categories.map((category) => {
      const count =
        products?.filter((product) =>
          product.tags.some((tag: string) =>
            category.tags.some(
              (catTag) => catTag.toLowerCase() === tag.toLowerCase(),
            ),
          ),
        ).length || 0;

      const tagsWithCount = category.tags.map((tag) => {
        const tagCount =
          products?.filter((product) =>
            product.tags.some(
              (productTag: string) =>
                productTag.toLowerCase() === tag.toLowerCase(),
            ),
          ).length || 0;

        return {
          name: tag,
          count: tagCount,
        };
      });

      return {
        name: category.name,
        slug: category.slug,
        count,
        tags: tagsWithCount,
      };
    });
  }, [products]);

  const filteredCategories = useMemo(() => {
    if (!search || !search.trim()) {
      return categoryStats;
    }

    const searchData = categoryStats.flatMap((category) => [
      { type: "category" as const, name: category.name, category },
      ...category.tags.map((tag) => ({
        type: "tag" as const,
        name: tag.name,
        category,
        tag,
      })),
    ]);

    const fuse = new Fuse(searchData, {
      keys: ["name"],
      threshold: 0.2,
      includeScore: true,
    });

    const results = fuse.search(search.trim());
    const matchedCategories = new Set<string>();
    const matchedTags = new Map<string, Set<string>>();

    results.forEach((result) => {
      const item = result.item;
      if (item.type === "category") {
        matchedCategories.add(item.category.name);
      } else {
        if (!matchedTags.has(item.category.name)) {
          matchedTags.set(item.category.name, new Set());
        }
        matchedTags.get(item.category.name)?.add(item.tag.name);
      }
    });

    return categoryStats
      .map((category) => {
        const categoryMatches = matchedCategories.has(category.name);
        const categoryTagMatches = matchedTags.get(category.name);

        if (!categoryMatches && !categoryTagMatches) {
          return null;
        }

        const filteredTags = categoryMatches
          ? category.tags
          : category.tags.filter((tag) => categoryTagMatches?.has(tag.name));

        return {
          ...category,
          tags: filteredTags,
        };
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null);
  }, [categoryStats, search]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-mono font-medium">Browse Products</h1>
          <h2 className="dark:text-muted-foreground text-gray-600 text-sm">
            Explore products by category
          </h2>
        </div>

        <Input
          type="text"
          placeholder="Search categories and tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md text-xs"
        />
      </div>

      <div className="flex flex-col">
        {filteredCategories.length === 0 && search && (
          <Alert>
            <AlertDescription className="mx-auto">
              No matching categories or tags found for &quot;{search}&quot;
            </AlertDescription>
          </Alert>
        )}

        {filteredCategories.map((category) => (
          <div key={category.name} className="space-y-2">
            <Link
              href={`/browse/${category.slug}`}
              className="group w-full flex items-center justify-start gap-x-1 hover:text-primary transition-colors"
            >
              <h4>{category.name}</h4>
              <span>({category.count})</span>
              <ArrowRight className="size-3 invisible group-hover:visible" />
            </Link>
            {category.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/browse/${category.slug}/${getTagSlug(tag.name)}`}
                    className="text-sm hover:underline dark:text-muted-foreground text-gray-600 hover:text-primary"
                  >
                    {tag.name} ({tag.count})
                  </Link>
                ))}
              </div>
            )}
            <Separator className="my-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
