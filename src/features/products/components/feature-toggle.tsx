"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleProductFeaturedAction } from "../actions";
import { useRouter } from "next/navigation";

interface FeatureToggleProps {
  productId: string;
  isFeatured: boolean;
}

export function FeatureToggle({ productId, isFeatured: initialIsFeatured }: FeatureToggleProps) {
  const router = useRouter();
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    setIsFeatured(checked);
    startTransition(async () => {
      const result = await toggleProductFeaturedAction(productId, checked);
      if (result.success) {
        toast.success(
          checked
            ? "Product is now featured"
            : "Product is no longer featured"
        );
        router.refresh();
      } else {
        // Revert on error
        setIsFeatured(!checked);
        toast.error(result.error || "Failed to update featured status");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={`feature-${productId}`}
        checked={isFeatured}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <Label
        htmlFor={`feature-${productId}`}
        className="text-sm cursor-pointer"
      >
        Featured
      </Label>
    </div>
  );
}

