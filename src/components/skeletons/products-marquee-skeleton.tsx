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
        <Skeleton className="h-7 w-48 rounded" />
        <div className="flex size-full items-center justify-center bg-background">
          <Marquee>
            <MarqueeFade side="left" />
            <MarqueeFade side="right" />
            <MarqueeContent>
              {Array.from({ length: 8 }).map((_, index) => (
                <MarqueeItem key={index} className="h-20 w-20">
                  <Skeleton className="h-20 w-20 rounded-full" />
                </MarqueeItem>
              ))}
            </MarqueeContent>
          </Marquee>
        </div>
      </div>
    </div>
  );
}

