"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-7xl font-bold font-mono text-foreground">S</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-foreground">
            Something went wrong!
          </h1>
          <p className="text-sm text-muted-foreground">
            We encountered an unexpected error. Please try again.
          </p>
        </div>
        <Button onClick={() => reset()} variant="secondary" size="lg">
          Try again
        </Button>
      </div>
    </div>
  );
}

