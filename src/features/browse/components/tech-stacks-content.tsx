"use client";

import { techStackCategories, getTechItem, type TechItem } from "@/utils/constants/tech-stack";
import { TechStackCount } from "../api/get-tech-stack-counts";
import Link from "next/link";

interface TechStacksContentProps {
  techStackCounts: TechStackCount[];
}

export function TechStacksContent({ techStackCounts }: TechStacksContentProps) {
  const countMap = new Map<string, number>();
  techStackCounts.forEach(({ name, count }) => {
    const normalized = name.toLowerCase();
    const existing = countMap.get(normalized) || 0;
    countMap.set(normalized, Math.max(existing, count));
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-medium mb-2">Browse by Tech Stack</h1>
        <p className="text-muted-foreground text-sm">
          Discover products built with specific technologies
        </p>
      </div>

      <div className="space-y-12">
        {techStackCategories.map((category) => {
          const itemsWithCounts = category.items
            .map((item) => {
              const count = countMap.get(item.name.toLowerCase()) || 0;
              return { item, count };
            })
            .sort((a, b) => b.count - a.count);

          return (
            <div key={category.name} className="space-y-3">
              <h2 className="text-base font-medium">{category.name}</h2>
              <div className="flex flex-wrap gap-2">
                {itemsWithCounts.map(({ item, count }) => (
                  <Link
                    key={item.name}
                    href={`/browse/tech-stacks/${encodeURIComponent(item.name)}`}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background hover:bg-accent transition-colors cursor-pointer text-xs">
                      <div
                        className="size-4 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-medium"
                        style={{ backgroundColor: `${item.color}15`, color: item.color }}
                      >
                        {item.icon ? (
                          <img
                            src={`https://cdn.simpleicons.org/${item.icon}/${item.color.replace("#", "")}`}
                            alt={item.name}
                            width={12}
                            height={12}
                            className="object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parent = target.parentElement;
                              if (parent) {
                                target.style.display = 'none';
                                parent.textContent = item.name.charAt(0).toUpperCase();
                              }
                            }}
                          />
                        ) : (
                          <span>{item.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">({count})</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

