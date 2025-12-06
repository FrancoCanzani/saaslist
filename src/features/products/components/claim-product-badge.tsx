"use client";

import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ClaimProductDialog } from "./claim-product-dialog";
import { Button } from "@/components/ui/button";

export function ClaimProductBadge({ productId }: {
    productId: string;
  }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="xs"
            onClick={() => setDialogOpen(true)}
          >
            Claim
          </Button>
        </TooltipTrigger>
        <TooltipContent>
            <p>This product was submitted by the editors</p>
        </TooltipContent>
      </Tooltip>
      <ClaimProductDialog
        productId={productId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

