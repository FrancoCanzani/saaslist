import {
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from "@/components/ui/marquee";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsMarqueeSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <Skeleton className="h-5 w-56 rounded mx-auto" />
        <div className="flex size-full items-center justify-center bg-background">
          <Marquee>
            <MarqueeFade side="left" />
            <MarqueeFade side="right" />
            <MarqueeContent>
              {Array.from({ length: 8 }).map((_, index) => (
                <MarqueeItem key={index} className="size-16">
                  <Skeleton className="size-16 rounded-full" />
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        </div>
      </div>
    </div>
  );
}

