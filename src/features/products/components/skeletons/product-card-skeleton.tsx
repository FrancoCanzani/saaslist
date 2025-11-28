import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="flex bg-surface/10 flex-col gap-2 py-2.5 px-4 h-[120px]">
      <div className="flex items-center justify-between">
        <div className="flex shrink-0 size-9 items-end justify-start">
          <Skeleton className="size-7 rounded" />
        </div>
        <Skeleton className="h-6 w-16 rounded" />
      </div>

      <div className="space-y-1.5 flex-1 flex flex-col justify-center">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
      </div>
    </Card>
  );
}

