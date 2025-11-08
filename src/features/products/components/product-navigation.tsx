"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface NavigationProduct {
  id: string;
  name: string;
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
      <h4 className="font-semibold mb-2">Navigate</h4>
      <div className="flex flex-col gap-2">
        {prevProduct && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 h-auto py-2"
            asChild
          >
            <Link href={`/products/${prevProduct.id}`}>
              <ChevronLeft className="size-4 shrink-0 text-muted-foreground" />
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
            className="w-full justify-start gap-2 h-auto py-2"
            asChild
          >
            <Link href={`/products/${nextProduct.id}`}>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  Next
                </span>
                <span className="text-xs font-medium truncate w-full">
                  {nextProduct.name}
                </span>
              </div>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
