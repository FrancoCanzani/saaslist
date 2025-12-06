"use client";

import { useTransition } from "react";
import { claimProductAction } from "../actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ClaimProductDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimProductDialog({
  productId,
  open,
  onOpenChange,
}: ClaimProductDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleClaim = () => {
    startTransition(async () => {
      try {
        const result = await claimProductAction(productId);
        if (result.success) {
          toast.success("Product claim submitted. It will be validated shortly.");
          onOpenChange(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to claim product");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Claim Product</AlertDialogTitle>
          <AlertDialogDescription>
            This operation will go forward but will be validated. You will
            receive ownership of this product once the claim is approved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <Button variant="outline" size="xs" asChild disabled={isPending}> 
          <AlertDialogCancel >
              Cancel
          </AlertDialogCancel>
          </Button>
          <Button size="xs" asChild disabled={isPending}>
          <AlertDialogAction onClick={handleClaim}>
              {isPending ? "Claiming..." : "Claim Product"}
          </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

