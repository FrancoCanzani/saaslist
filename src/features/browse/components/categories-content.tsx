"use client";

import { categories } from "@/utils/constants/categories";
import Link from "next/link";

export function CategoriesContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-2">Browse by Categories</h1>
        <p className="text-muted-foreground text-sm">
          Explore products organized by categories and tags
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category.slug} className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium">{category.name}</h2>
              <Link
                href={`/browse/category/${category.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View all →
              </Link>
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/browse/category/${category.slug}?tag=${encodeURIComponent(tag)}`}
                  className="text-sm hover:underline"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

