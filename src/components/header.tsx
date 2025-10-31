import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/profiles/api";
import { ProfileDropdown } from "@/features/profiles/components/ProfileDropdown";
import Link from "next/link";

export default async function Header() {
  const { user, profile } = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 p-4 md:p-6 inline-flex items-center justify-between w-full text-sm backdrop-blur-lg bg-background/80">
      <Link href={"/"} className="font-mono font-medium text-xl">
        SaasList
      </Link>
      <div className="inline-flex flex-1 justify-center gap-6 *:font-medium">
        <Link href={"/browse"}>Browse</Link>
        <Link href={"#"}>Leaderboard</Link>
        <Link href={"#"}>Makers</Link>
        <Link href={"/newsletter"}>Newsletter</Link>
        <Link href={"#"}>Advertise</Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Button className="font-medium" size={"sm"} variant={"secondary"}>
              <Link
                href={"/products/new"}
                className="flex items-center justify-center gap-x-1"
              >
                New Product
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  viewBox="0 0 20 24"
                >
                  <path
                    d="M17.4906 11.0361C17.1898 10.6437 16.8237 10.3037 16.4837 9.96371C15.6075 9.17906 14.6136 8.61673 13.7766 7.79284C11.8281 5.88352 11.3965 2.73184 12.6389 0.3125C11.3965 0.613283 10.3111 1.29331 9.38256 2.03873C5.99549 4.75886 4.66158 9.55831 6.25704 13.6777C6.30935 13.8085 6.36166 13.9393 6.36166 14.1093C6.36166 14.397 6.16549 14.6585 5.90394 14.7632C5.60316 14.8939 5.2893 14.8155 5.04083 14.6062C4.96661 14.5441 4.90453 14.4687 4.85774 14.3839C3.37998 12.5138 3.14459 9.83294 4.13848 7.68822C1.95453 9.46676 0.764478 12.4746 0.934486 15.3124C1.01295 15.9663 1.09142 16.6202 1.31373 17.274C1.49682 18.0587 1.84991 18.8433 2.24224 19.5365C3.65461 21.7989 6.10011 23.4205 8.72869 23.7474C11.5273 24.1005 14.522 23.5905 16.6667 21.655C19.0599 19.4841 19.8969 16.0055 18.6676 13.0238L18.4976 12.6838C18.223 12.0823 17.4906 11.0361 17.4906 11.0361ZM13.3581 19.2749C12.992 19.5888 12.3904 19.9288 11.9196 20.0596C10.4549 20.5827 8.99024 19.8503 8.12712 18.9872C9.68335 18.621 10.6118 17.4702 10.8865 16.3063C11.1088 15.2601 10.6903 14.397 10.5203 13.39C10.3634 12.4223 10.3895 11.5984 10.7426 10.6961C10.9911 11.193 11.2526 11.6899 11.5665 12.0823C12.5735 13.39 14.1559 13.9654 14.4959 15.744C14.5482 15.9271 14.5743 16.1101 14.5743 16.3063C14.6136 17.3787 14.1428 18.5556 13.3581 19.2749Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </Link>
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
