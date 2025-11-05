import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/profiles/api";
import { ProfileDropdown } from "@/features/profiles/components/ProfileDropdown";
import Link from "next/link";

export default async function Header() {
  const { user, profile } = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 p-4 md:p-6 inline-flex items-center justify-between w-full text-sm backdrop-blur-lg bg-background/80">
      <Link href={"/"} className="font-mono font-medium text-lg md:text-2xl">
        SaasList
      </Link>
      <div className="inline-flex flex-1 justify-center gap-6 *:font-medium">
        <Link href={"/browse"} className="hidden md:block">
          Browse
        </Link>
        <Link href={"#"} className="hidden md:block">
          Leaderboard
        </Link>
        <Link href={"/newsletter"} className="hidden md:block">
          Newsletter
        </Link>
        <Link href={"/advertise"} className="hidden md:block">
          Advertise
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button
              className="text-white leading-none bg-linear-to-br from-blue-500 to-blue-700 hover:scale-95 transition-all duration-300 shadow-lg shadow-blue-500/40"
              size={"sm"}
              variant={"secondary"}
            >
              <Link href={"/products/new"}>New Product</Link>
            </Button>
            {profile ? (
              <ProfileDropdown profile={profile} />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">U</span>
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
