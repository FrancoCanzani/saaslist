import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Product } from "../types";
import ProductLogo from "./product-logo";
import UpvoteButton from "./upvote-button";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex border hover:bg-muted group rounded flex-col gap-2 py-2.5 px-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex shrink-0 size-9 items-end justify-start">
          <ProductLogo
            logoUrl={product.logo_url}
            productName={product.name}
            size={28}
          />
        </div>
        <UpvoteButton
          label={product.is_upvoted ? "Upvoted" : "Upvote"}
          product={product}
          className="text-sm"
        />
      </div>

      <h3 className="font-mono flex items-center justify-start gap-x-1 underline underline-offset-4">
        {product.name}
        <ArrowUpRight className="opacity-0  transition-all group-hover:opacity-100 duration-300 size-3.5" />
      </h3>

      <p className="text-sm text-muted-foreground">{product.tagline}</p>
    </Link>
  );
}
