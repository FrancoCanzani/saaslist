"use client";

import { Input } from "@/components/ui/input";
import { tags } from "@/utils/constants";
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
    return tags.map((category) => {
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
      <div>
        <h1 className="text-xl font-medium">Browse Products</h1>
        <p className="text-muted-foreground text-sm">
          Explore products by category
        </p>
      </div>

      <Input
        type="text"
        placeholder="Search categories and tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {search && (
        <div className="text-sm text-muted-foreground">
          {filteredCategories.length === 0 ? (
            <p>No matching categories or tags found for &quot;{search}&quot;</p>
          ) : (
            <p>
              Found {filteredCategories.length}{" "}
              {filteredCategories.length === 1 ? "category" : "categories"}
            </p>
          )}
        </div>
      )}

      <div className="space-y-8 flex flex-col">
        {filteredCategories.length === 0 && !search && (
          <p className="text-muted-foreground text-sm">No products found.</p>
        )}

        {filteredCategories.length === 0 && search && (
          <div className="border-dashed border p-8 rounded-xl text-muted-foreground text-center">
            No matching categories or tags found for &quot;{search}&quot;
          </div>
        )}

        {filteredCategories.map((category) => (
          <Link
            href={`/browse/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="group space-y-2 rounded-md bg-gray-50 p-2 transition-all"
            key={category.name}
          >
            <h4 className="w-full flex items-center justify-start gap-x-1">
              {category.name}
              <span>({category.count})</span>
              <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </h4>
            {category.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/browse/${category.name.toLowerCase().replace(/\s+/g, "-")}?tag=${encodeURIComponent(tag.name)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs hover:underline">
                      {tag.name} ({tag.count})
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
