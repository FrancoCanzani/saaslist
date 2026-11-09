import { useQuery } from "@tanstack/react-query"
import { Link, useRouterState } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { Button } from "@components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import { api } from "@lib/api"
import { authClient } from "@lib/auth/client"

import { raisedPrimaryClass } from "./raised-primary"

export function AuthSection({
  session,
}: {
  session: {
    user: { id: string; name: string; email: string }
  } | null
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const me = useQuery({
    queryKey: ["me", session?.user.id ?? null],
    enabled: Boolean(session),
    queryFn: async () => {
      const response = await api.me.$get()
      if (!response.ok) {
        return { editor: false }
      }
      return response.json()
    },
  })

  if (!session) {
    return (
      <Button asChild size="xs" variant="secondary" className="font-medium">
        <Link to="/sign-in" search={{ redirect: pathname }}>
          Sign In
        </Link>
      </Button>
    )
  }

  const initials = (session.user.name ?? session.user.email)
    .split(" ")
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      <Button asChild size="xs" className={raisedPrimaryClass}>
        <Link to="/submit">New Product</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded bg-gray-200 transition-colors hover:bg-gray-300 focus:ring focus:ring-neutral-500 focus:ring-offset focus:outline-none"
            aria-label="Profile menu"
          >
            <span className="text-sm font-medium text-muted-foreground">
              {initials || "U"}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <span className="block text-sm font-medium leading-none">
              {session.user.name || session.user.email}
            </span>
            <span className="mt-1 block text-xs font-normal text-muted-foreground">
              {session.user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/mine" className="cursor-pointer text-xs">
              Your products
            </Link>
          </DropdownMenuItem>
          {me.data?.editor ? (
            <>
              <DropdownMenuItem asChild>
                <Link to="/review" className="cursor-pointer text-xs">
                  Review
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/outreach" className="cursor-pointer text-xs">
                  Outreach
                </Link>
              </DropdownMenuItem>
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onSelect={() => {
              void authClient.signOut().then(() => {
                window.location.assign("/")
              })
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="secondary" size="xs" aria-label="Navigation menu">
          <Menu className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to="/categories" className="cursor-pointer text-xs">
            Browse - Categories
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/" className="cursor-pointer text-xs">
            Browse - All
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/tech-stacks" className="cursor-pointer text-xs">
            Browse - Tech Stack
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/newsletter" className="cursor-pointer text-xs">
            Newsletter
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/advertise" className="cursor-pointer text-xs">
            Advertise
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
