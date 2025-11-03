"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductLogoProps {
  logoUrl?: string | null;
  productName: string;
  size?: number;
}

export default function ProductLogo({
  logoUrl,
  productName,
  size = 25,
}: ProductLogoProps) {
  const [imageError, setImageError] = useState(false);

  if (logoUrl && !imageError) {
    return (
      <Image
        src={logoUrl}
        alt={`${productName} logo`}
        width={size}
        height={size}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="size-9 flex text-blue-800 items-center font-medium justify-center">
      {productName.split("")[0]}
    </div>
  );
}
