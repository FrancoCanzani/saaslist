import { MobileNav } from "@/components/mobile-nav";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/profiles/api";
import { ProfileDropdown } from "@/features/profiles/components/ProfileDropdown";
import Link from "next/link";

export default async function Header() {
  const { user, profile } = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 p-4 sm:p-6 lg:p-8 inline-flex items-center justify-between w-full text-sm backdrop-blur-lg bg-background/80">
      <Link href={"/"} className="font-mono font-medium text-lg md:text-2xl">
        SaasList
      </Link>
      <div
        className="inline-flex flex-1 justify-center gap-6 *:font-medium
        *:hidden *:md:block *:hover:text-blaze-orange
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
            <Button
              className="bg-blaze-orange hover:bg-blaze-orange/90 text-white"
              size={"xs"}
              variant={"secondary"}
            >
              <Link href={"/products/new"}>New Product</Link>
            </Button>
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
          <Link href="/login" className="font-medium">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
