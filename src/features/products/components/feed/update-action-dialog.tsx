"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UpdateForm } from "./update-form";

interface UpdateActionDialogProps {
  productId: string;
  isMobile: boolean;
  children: React.ReactNode;
}

export function UpdateActionDialog({
  productId,
  isMobile,
  children,
}: UpdateActionDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSuccess = () => {
    setOpen(false);
    router.refresh();
  };

  const content = (
    <>
      {isMobile ? (
        <SheetHeader>
          <SheetTitle>Share an Update</SheetTitle>
        </SheetHeader>
      ) : (
        <DialogHeader>
          <DialogTitle>Share an Update</DialogTitle>
        </DialogHeader>
      )}
      <UpdateForm
        productId={productId}
        onSuccess={handleSuccess}
        onCancel={() => setOpen(false)}
      />
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {content}
      </DialogContent>
    </Dialog>
  );
}

