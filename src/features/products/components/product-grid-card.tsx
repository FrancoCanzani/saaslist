import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Product } from "../types";
import ProductLogo from "./product-logo";
import UpvoteButton from "./upvote-button";

interface ProductGridCardProps {
  product: Product;
  index: number;
  totalProducts: number;
}

export default function ProductGridCard({
  product,
  index,
  totalProducts,
}: ProductGridCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={`group hover:dark:bg-blaze-orange/5 hover:bg-neutral-50 flex items-center justify-between gap-3 p-3 border-b transition-colors
        lg:border-r
        ${index % 2 === 1 ? "lg:border-r-0" : ""}
        ${index >= totalProducts - (totalProducts % 2 || 2) ? "lg:border-b-0" : ""}
        ${index === totalProducts - 1 ? "border-b-0" : ""}`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="size-10 flex items-center justify-center shrink-0 rounded group-hover:scale-105 transition-all duration-300">
          <ProductLogo
            logoUrl={product.logo_url}
            productName={product.name}
            size={28}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate group-hover:text-blaze-orange font-mono uppercase transition-colors flex items-center justify-start gap-x-1.5">
            <span className="truncate">{product.name}</span>
            <ArrowUpRight className="size-4 group-hover:visible invisible shrink-0" />
          </h3>
          <p className="text-sm text-gray-600 dark:text-muted-foreground line-clamp-1">
            {product.tagline}
          </p>
        </div>
      </div>
      <UpvoteButton
        product={product}
        size={"sm"}
        label="Upvotes"
        className="shadow-none shrink-0"
      />
    </Link>
  );
}
