"use client";

import { Product } from "@/features/products/types";
import { TagCategory } from "@/utils/constants";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useQueryState } from "nuqs";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { useMemo } from "react";
import ProductCard from "@/features/products/components/product-card";

interface BrowseCategoryClientProps {
  category: TagCategory;
  products: Product[];
  allCategories: TagCategory[];
  currentCategorySlug: string;
}

export default function BrowseSidebar({
  category,
  products,
  allCategories,
  currentCategorySlug,
}: BrowseCategoryClientProps) {
  const [subcategory, setSubcategory] = useQueryState("subcategory");
  const [search, setSearch] = useQueryState("search");

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (subcategory) {
      filtered = filtered.filter((product) =>
        product.tags.some(
          (tag) => tag.toLowerCase() === subcategory.toLowerCase()
        )
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.tagline.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, subcategory, search]);

  const handleClearFilters = () => {
    setSubcategory(null);
    setSearch(null);
  };

  const hasActiveFilters = subcategory || search;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {allCategories.map((cat) => {
                  const catSlug = cat.name
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  const isActive = catSlug === currentCategorySlug;

                  return (
                    <Collapsible
                      key={cat.name}
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={`/browse/${catSlug}`}>
                            <span>{cat.name}</span>
                          </Link>
                        </SidebarMenuButton>
                        <CollapsibleTrigger asChild>
                          <button className="absolute right-3 top-1.5 flex items-center justify-center">
                            <ChevronDown className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {cat.tags.map((tag) => (
                              <SidebarMenuSubItem key={tag}>
                                <SidebarMenuSubButton
                                  onClick={() => setSubcategory(tag)}
                                  isActive={subcategory === tag}
                                >
                                  {tag}
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Input
                placeholder="Search products..."
                value={search || ""}
                onChange={(e) => setSearch(e.target.value || null)}
                className="max-w-md"
              />
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="size-4 mr-2" />
                  Clear filters
                </Button>
              )}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
              {subcategory && ` in ${subcategory}`}
              {search && ` matching "${search}"`}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="border-dashed border p-8 rounded-xl text-muted-foreground text-center">
              No products found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

