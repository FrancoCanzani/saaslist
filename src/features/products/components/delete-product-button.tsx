"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteProductAction } from "../actions";

export function DeleteProductButton({
  productId,
  productName,
}: {
    productId: string;
    productName: string;
  }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProductAction(productId);
        toast.success(`Deleted "${productName}"`);
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete product";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="xs" disabled={isPending}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {productName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove your
            product and its associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button asChild size="xs" variant="outline">
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          </Button>
          <Button asChild size="xs" variant="destructive">
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Delete
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

