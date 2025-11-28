import { cn } from "@/lib/utils";
import { OliveBranchIcon } from "@/utils/icons";

export default function FeaturedBadge({ className }: { className?: string }) {
  return (
    <div
      title="Featured product"
      className={cn(
        "flex shadow-xs bg-muted/50 items-center border px-1.5 py-0.5 text-xs rounded-lg gap-1.5",
        className,
      )}
    >
      <OliveBranchIcon className="text-amber-500" />
      <span className="hidden md:block">Featured</span>
    </div>
  );
}
