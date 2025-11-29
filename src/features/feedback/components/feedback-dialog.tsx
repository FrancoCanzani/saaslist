"use client";

import { useState, useTransition } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { feedbackSchema } from "../schemas";
import { submitFeedbackAction } from "../actions";
import { toast } from "sonner";
import z from "zod";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const isMobile = useIsMobile();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    const result = feedbackSchema.safeParse({ message });

    if (!result.success) {
      const flattened = z.flattenError(result.error);
      setError(flattened.fieldErrors.message?.[0] || "Invalid input");
      return;
    }

    startTransition(async () => {
      const response = await submitFeedbackAction({ message });

      if (response.success) {
        toast.success("Thanks for your feedback!");
        setMessage("");
        onOpenChange(false);
      } else {
        setError(response.error || "Something went wrong");
      }
    });
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setMessage("");
      setError(null);
    }
    onOpenChange(open);
  };

  const content = (
    <>
      <Textarea
        placeholder="What's on your mind?"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (error) setError(null);
        }}
        className="min-h-[200px] resize-none"
        aria-invalid={!!error}
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleClose}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="text-start">Send Feedback</DrawerTitle>
            <DrawerDescription className="sr-only">
              Share your thoughts with us
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-2 space-y-2">{content}</div>
          <DrawerFooter>
            <Button onClick={handleSubmit} disabled={isPending} size="sm">
              {isPending ? "Sending..." : "Send"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription className="sr-only">
            Share your thoughts with us
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">{content}</div>
        <Button onClick={handleSubmit} disabled={isPending} size="sm">
          {isPending ? "Sending..." : "Send"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

