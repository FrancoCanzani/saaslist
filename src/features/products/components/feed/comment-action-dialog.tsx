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
import CommentForm from "./comment-form";

interface CommentActionDialogProps {
  productId: string;
  isMobile: boolean;
  children: React.ReactNode;
}

export function CommentActionDialog({
  productId,
  isMobile,
  children,
}: CommentActionDialogProps) {
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
          <SheetTitle>Write a Comment</SheetTitle>
        </SheetHeader>
      ) : (
        <DialogHeader>
          <DialogTitle>Write a Comment</DialogTitle>
        </DialogHeader>
      )}
      <CommentForm productId={productId} onSuccess={handleSuccess} />
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

