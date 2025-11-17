import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-7xl font-bold font-mono text-foreground">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-medium text-foreground">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="secondary" size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/browse">Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

