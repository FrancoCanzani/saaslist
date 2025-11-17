import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Product } from "../types";
import ProductLogo from "./product-logo";
import LikeButton from "./like-button";
import { Card } from "@/components/ui/card";
import { OliveBranchIcon } from "@/utils/icons";

export default function ProductCard({
  product,
  position,
}: {
  product: Product;
  position?: number;
}) {
  return (
    <Link prefetch href={`/products/${product.id}`}>
      <Card className="flex bg-surface/10 hover:bg-surface/80 group flex-col gap-2 py-2.5 px-4 h-[120px]">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0 size-9 items-end justify-start">
            <ProductLogo
              logoUrl={product.logo_url}
              productName={product.name}
              size={28}
            />
          </div>
          <div className="flex items-center justify-end space-x-2">
            {product.is_featured && (
              <div className="flex items-center border h-7 px-2 py-1.5 text-xs rounded justify-start space-x-1.5">
                <OliveBranchIcon className="text-amber-500" />
                <span className="font-medium text-muted-foreground">
                  Featured
                </span>
              </div>
            )}
            <LikeButton product={product} size="xs" />
          </div>
        </div>

        <div className="flex items-center justify-start space-x-1">
          <span className="text-muted-foreground">
            {position && `#${position}`}
          </span>
          <h3 className="flex items-center justify-start gap-x-1 underline underline-offset-2 line-clamp-1">
            {product.name}
            <ArrowRight className="opacity-0  transition-all group-hover:opacity-100 duration-300 size-3.5 shrink-0" />
          </h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {product.tagline}
        </p>
      </Card>
    </Link>
  );
}
