import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function LatestProductUpdatesSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-48 rounded" />
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card
            key={i}
            className="flex bg-surface/10 flex-col gap-3 py-3 px-4 h-auto min-h-[100px]"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
