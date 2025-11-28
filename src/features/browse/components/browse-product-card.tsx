import FeaturedBadge from "@/features/products/components/featured-badge";
import ProductLogo from "@/features/products/components/product-logo";
import { Product } from "@/features/products/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function BrowseProductCard({ product }: { product: Product }) {
  return (

    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col w-[320px] gap-2 shrink-0 p-3 rounded-xl border border-border/50 hover:border-border bg-background hover:bg-surface/80 shadow-xs transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <ProductLogo
            logoUrl={product.logo_url}
            productName={product.name}
            size="sm"
          />
          <span className="font-medium truncate">{product.name}</span>
        </div>
        {product.is_featured && <FeaturedBadge />}
      </div>

      <p className="text-xs mb-2">{product.tagline}</p>

      <p className="text-xs text-muted-foreground line-clamp-3 flex-1">
        {product.description}
      </p>

      <div className="flex items-center justify-end">
        <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
          View Product
          <ArrowRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </span>
      </div>
    </Link>
  );
}
