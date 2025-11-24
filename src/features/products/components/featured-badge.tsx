import { OliveBranchIcon } from "@/utils/icons";

export default function FeaturedBadge() {
  return (
    <div className="flex shadow-xs items-center border h-7 px-2 py-1.5 text-xs rounded-lg gap-1.5">
      <OliveBranchIcon className="text-amber-500" />
      <span className="font-medium hidden md:block text-muted-foreground">
        Featured
      </span>
    </div>
  );
}
