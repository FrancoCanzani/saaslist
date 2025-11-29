import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLogoCloudSkeleton() {
  const logoHeights = ["h-6", "h-7", "h-8", "h-9", "h-7", "h-6", "h-7", "h-8", "h-6", "h-7", "h-8", "h-9"];

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Skeleton className="h-5 w-56 rounded mx-auto" />
        <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
          {Array.from({ length: 12 }).map((_, index) => {
            const heightClass = logoHeights[index % logoHeights.length];
            return (
              <Skeleton
                key={index}
                className={`${heightClass} w-24 rounded`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

