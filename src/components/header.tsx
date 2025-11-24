import { MobileNav } from "@/components/mobile-nav";
import { ProductSearchDialog } from "@/components/product-search";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/features/profiles/api";
import { ProfileDropdown } from "@/features/profiles/components/Profile-dropdown";
import Link from "next/link";

interface HeaderProps {
  containerClassName?: string;
}

export default async function Header({ containerClassName }: HeaderProps = {}) {
  const { user, profile } = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/20 dark:bg-background/80 backdrop-blur-lg">
      <div className={cn("max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-between text-sm w-full", containerClassName)}>
        <Link href={"/"} className="font-mono font-medium text-3xl">
          SaasList
        </Link>
        <div
          className="inline-flex flex-1 items-center justify-center gap-6 *:font-medium
          *:hidden *:md:block *:hover:text-muted-foreground
          "
        >
          <Link href={"/browse"}>Browse</Link>
          <Link href={"/leaderboard"}>Leaderboard</Link>
          <Link href={"/newsletter"}>Newsletter</Link>
          <Link href={"/advertise"}>Advertise</Link>
        </div>
        <div className="flex items-center gap-4">
          <MobileNav />
          {user ? (
            <>
              <Button size={"xs"}>
                <Link href={"/products/new"}>New Product</Link>
              </Button>

              <ProductSearchDialog />

              {profile ? (
                <ProfileDropdown profile={profile} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    U
                  </span>
                </div>
              )}
            </>
          ) : (
            <Button
              asChild
              size={"xs"}
              variant={"secondary"}
              className="font-medium"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
