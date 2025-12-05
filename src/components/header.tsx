import { MobileNav } from "@/components/mobile-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthSection } from "@/features/profiles/components/auth-section";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Header({
  containerClassName,
}: {
  containerClassName?: string;
} = {}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface/20 dark:bg-background/80 backdrop-blur-lg">
      <div
        className={cn(
          "max-w-6xl mx-auto p-4 sm:p-6 flex items-center justify-between text-sm w-full",
          containerClassName,
        )}
      >
        <Link href="/" className="font-mono font-medium text-3xl">
          SaasList
        </Link>
        <div
          className="inline-flex flex-1 items-center justify-center gap-6 *:font-medium
          *:hidden *:md:flex *:hover:text-muted-foreground"
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="items-center gap-1 hover:text-muted-foreground">
              Browse
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="*:text-xs">
              <DropdownMenuItem asChild>
                <Link href="/browse/all">All</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/browse/categories">Categories</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/browse/tech-stacks">Tech Stack</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="/advertise">Advertise</Link>
        </div>
        <div className="flex items-center gap-4">
          <MobileNav />
          <AuthSection />
        </div>
      </div>
    </header>
  );
}
