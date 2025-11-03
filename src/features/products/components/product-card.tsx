"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="flex-col flex p-4 min-w-0">
        <div className="flex items-center space-x-2">
          <div className="rounded-md w-8 flex items-center justify-center h-8 bg-gray-50 p-1">
            {product.logo_url && !imageError ? (
              <Image
                src={product.logo_url}
                alt={`${product.name} logo`}
                width={20}
                height={20}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="h-9 w-9 flex items-center font-medium justify-center">
                {product.name.split("")[0]}
              </div>
            )}
          </div>
          <h2 className="group group-hover:text-blue-600 inline-flex items-center gap-1 font-medium transition-colors duration-100 text-left">
            {product.name}
            <ArrowUpRight className="opacity-0 size-3.5 group-hover:opacity-100 transition-opacity" />
          </h2>
        </div>

        <div className="text-sm flex items-center gap-2 min-w-0">
          <h3 className="truncate shrink">{product.tagline}</h3>
          <div className="flex items-center gap-2 shrink-0">
            <Tags className="size-3" />
            {product.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                className="hover:underline text-xs bg-gray-100 px-1.5 py-0.5 rounded"
                key={index}
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-xs">+{product.tags.length - 3}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
