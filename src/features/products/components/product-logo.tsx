"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import { useState } from "react";

const productLogoVariants = cva(
  "flex items-center justify-center shrink-0 rounded-xl overflow-hidden dark:bg-zinc-50 dark:border dark:border-zinc-200/50 dark:p-0.5",
  {
    variants: {
      size: {
        xs: "size-4",
        sm: "size-6",
        md: "size-9",
        lg: "size-11",
        xl: "size-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const logoImageSizes = {
  xs: 14,
  sm: 20,
  md: 32,
  lg: 40,
  xl: 52,
};

interface ProductLogoProps extends VariantProps<typeof productLogoVariants> {
  logoUrl?: string | null;
  productName: string;
  className?: string;
}

export default function ProductLogo({
  logoUrl,
  productName,
  size = "md",
  className,
}: ProductLogoProps) {
  const [imageError, setImageError] = useState(false);

  const logoSize = logoImageSizes[size || "md"];

  return (
    <div className={cn(productLogoVariants({ size }), className)}>
      {logoUrl && !imageError ? (
        <Image
          src={logoUrl}
          alt={`${productName} logo`}
          width={logoSize}
          height={logoSize}
          onError={() => setImageError(true)}
          className="object-contain rounded mix-blend-luminosity group-hover:brightness-120 transition-all duration-200"
        />
      ) : (
        <div
          className="flex rounded bg-surface items-center font-medium justify-center w-full h-full mix-blend-luminosity group-hover:brightness-120 transition-all duration-200"
          style={{ fontSize: logoSize * 0.5 }}
        >
          {productName.split("")[0]}
        </div>
      )}
    </div>
  );
}
