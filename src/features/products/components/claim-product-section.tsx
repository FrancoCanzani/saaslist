"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ClaimProductDialog } from "./claim-product-dialog";

interface ClaimProductSectionProps {
  productId: string;
}

export function ClaimProductSection({ productId }: ClaimProductSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="flex border bg-yellow-50 rounded-lg items-center justify-between gap-2 text-xs text-center group dark:bg-input/30 dark:border-input gap-x-1.5 px-2 py-1 outline-transparent hover:not-disabled:outline-2 w-full rounded-xl font-medium flex-row">
        <p className="font-medium">This product was submitted by the editors</p>
        <Button
          onClick={() => setDialogOpen(true)}
          variant="outline"
          size="xs"
          className="w-fit"
        >
          Claim Product
        </Button>
      </div>
      <ClaimProductDialog
        productId={productId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
