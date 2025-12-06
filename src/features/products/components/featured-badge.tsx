import { cn } from "@/lib/utils";
import { OliveBranchIcon } from "@/utils/icons";

export default function FeaturedBadge({ className }: { className?: string }) {
  return (
    <div
      title="Featured product"
      className={cn("flex bg-muted/50 items-center text-xs gap-1.5", className)}
    >
      <OliveBranchIcon className="text-amber-500" />
      <span className="hidden md:block">Featured</span>
    </div>
  );
}
