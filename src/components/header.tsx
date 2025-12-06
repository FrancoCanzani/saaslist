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
    <header className="sticky top-0 z-50 w-full bg-surface/20 dark:bg-background/80 backdrop-blur-3xl">
      <div
        className={cn(
          "mx-auto max-w-7xl px-6 py-2 lg:px-12",
          containerClassName,
        )}
      >
        <div className="grid grid-cols-2 gap-12 items-end">
          <div className="flex flex-col">
            <Link
              href="/"
              className="font-mono leading-none font-medium text-3xl"
            >
              S
            </Link>
          </div>

          <div className="flex items-end justify-between">
            <nav className="flex gap-6 text-sm text-muted-foreground *:font-medium *:hidden *:md:flex *:hover:text-foreground *:transition-colors">
              <DropdownMenu>
                <DropdownMenuTrigger className="items-center gap-1 hover:text-foreground">
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
            </nav>
            <div className="flex items-center gap-4">
              <MobileNav />
              <AuthSection />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
