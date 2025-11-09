"use client";

import { Button } from "@/components/ui/button";
import ProductLogo from "@/features/products/components/product-logo";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface NavigationProduct {
  id: string;
  name: string;
  logo_url?: string | null;
}

interface ProductNavigationProps {
  prevProduct: NavigationProduct | null;
  nextProduct: NavigationProduct | null;
}

export function ProductNavigation({
  prevProduct,
  nextProduct,
}: ProductNavigationProps) {
  if (!prevProduct && !nextProduct) {
    return null;
  }

  return (
    <div>
      <h4 className="font-medium mb-2">Navigate</h4>
      <div className="flex flex-col gap-2">
        {prevProduct && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 h-auto py-2"
            asChild
          >
            <Link href={`/products/${prevProduct.id}`}>
              <ChevronLeft className="size-4 shrink-0 text-blaze-orange" />
              <div className="size-6 flex items-center justify-center shrink-0">
                <ProductLogo
                  logoUrl={prevProduct.logo_url}
                  productName={prevProduct.name}
                  size={20}
                />
              </div>
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Previous
                </span>
                <span className="text-xs font-medium truncate w-full">
                  {prevProduct.name}
                </span>
              </div>
            </Link>
          </Button>
        )}

        {nextProduct && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-end gap-2 h-auto py-2"
            asChild
          >
            <Link href={`/products/${nextProduct.id}`}>
              <div className="size-6 flex items-center justify-center shrink-0">
                <ProductLogo
                  logoUrl={nextProduct.logo_url}
                  productName={nextProduct.name}
                  size={20}
                />
              </div>
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Next
                </span>
                <span className="text-xs font-medium truncate w-full">
                  {nextProduct.name}
                </span>
              </div>
              <ChevronRight className="size-4 shrink-0 text-blaze-orange" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
