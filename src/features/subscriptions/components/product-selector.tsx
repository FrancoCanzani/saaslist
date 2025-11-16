"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Product } from "@/features/products/types";

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string | null;
  onProductChange: (productId: string | null) => void;
}

export function ProductSelector({
  products,
  selectedProductId,
  onProductChange,
}: ProductSelectorProps) {
  if (products.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Select Product</Label>
        <p className="text-sm text-muted-foreground">
          You need to create a product first.{" "}
          <a href="/products/new" className="underline">
            Create a product
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="product-select">Select Product to Feature</Label>
      <Select
        value={selectedProductId || undefined}
        onValueChange={(value) => onProductChange(value || null)}
      >
        <SelectTrigger id="product-select">
          <SelectValue placeholder="Choose a product" />
        </SelectTrigger>
        <SelectContent>
          {products.map((product) => (
            <SelectItem key={product.id} value={product.id}>
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        All products under your profile will be featured
      </p>
    </div>
  );
}

