import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="gap-4 w-full max-w-sm h-full flex flex-col">
      <Skeleton className="size-9 rounded-xl" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <Skeleton className="h-3 w-2/3 rounded" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
      <div className="flex items-center justify-end">
        <Skeleton className="h-3 w-20 rounded" />
      </div>
    </Card>
  );
}

