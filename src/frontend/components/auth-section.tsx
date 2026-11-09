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
      <Button
        size="xs"
        variant="secondary"
        className="font-medium"
        render={<Link to="/sign-in" search={{ redirect: pathname }} />}
      >
        Sign In
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
      <Button
        size="xs"
        className={raisedPrimaryClass}
        render={<Link to="/submit" />}
      >
        New Product
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex size-7 items-center justify-center rounded bg-gray-200 transition-colors hover:bg-gray-300 focus:ring focus:ring-neutral-500 focus:ring-offset focus:outline-none"
              aria-label="Profile menu"
            />
          }
        >
          <span className="text-sm font-medium text-muted-foreground">
            {initials || "U"}
          </span>
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
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            render={<Link to="/mine" />}
          >
            Your products
          </DropdownMenuItem>
          {me.data?.editor ? (
            <>
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                render={<Link to="/review" />}
              >
                Review
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                render={<Link to="/outreach" />}
              >
                Outreach
              </DropdownMenuItem>
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => {
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
      <DropdownMenuTrigger
        className="md:hidden"
        render={
          <Button variant="secondary" size="xs" aria-label="Navigation menu" />
        }
      >
        <Menu className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          render={<Link to="/categories" />}
        >
          Browse - Categories
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          render={<Link to="/" />}
        >
          Browse - All
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          render={<Link to="/tech-stacks" />}
        >
          Browse - Tech Stack
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          render={<Link to="/newsletter" />}
        >
          Newsletter
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          render={<Link to="/advertise" />}
        >
          Advertise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
