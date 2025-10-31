"use client";

import { Product } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, MessageSquare, Tags } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UpvoteButton from "./upvote-button";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="duration-100 ease-out outline-transparent not-disabled:cursor-pointer hover:not-disabled:outline-[3px] hover:not-disabled:outline-border/50 hover:not-disabled:border-ring focus-visible:outline-[3px] focus-visible:outline-border/50 focus-visible:border-ring group relative flex items-center gap-3 w-full border bg-card px-3 py-2 rounded-xl hover:bg-yellow-200">
        <div className="rounded-md w-8 flex items-center justify-center h-8 bg-gray-100 p-1">
          {product.logo_url ? (
            <Image
              src={product.logo_url}
              alt={`${product.name} logo`}
              width={20}
              height={20}
            />
          ) : (
            <div className="h-9 w-9 flex items-center font-medium italic justify-center">
              {product.name.split("")[0]}
            </div>
          )}
        </div>
        <div className="flex-col flex flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(product.website_url, "_blank", "noopener,noreferrer");
            }}
            className="group group-hover:text-blue-600 inline-flex items-center gap-1 font-medium transition-colors duration-100 text-left"
          >
            {product.name}
            <ArrowUpRight className="opacity-0 size-3.5 group-hover:opacity-100 transition-opacity" />
          </button>
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
        </div>
        <div className="flex-1 flex items-center justify-end gap-x-2">
          <Button
            variant={"secondary"}
            size={"sm"}
            className="text-xs font-medium"
          >
            <MessageSquare className="size-3" />
            {product.comments_count}
          </Button>
          <UpvoteButton product={product} />
        </div>
      </div>
    </Link>
  );
}

