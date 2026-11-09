import { Link, getRouteApi } from "@tanstack/react-router"
import { ChevronDown } from "lucide-react"

import { cn } from "@lib/utils"

import { AuthSection, MobileNav } from "./auth-section"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const rootApi = getRouteApi("__root__")

export function Header({
  containerClassName,
}: {
  containerClassName?: string
} = {}) {
  const { session } = rootApi.useRouteContext()

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/20 backdrop-blur-3xl dark:bg-background/80">
      <div className={cn("mx-auto max-w-7xl px-6 py-2 lg:px-12", containerClassName)}>
        <div className="grid grid-cols-2 items-end gap-12">
          <div className="flex flex-col">
            <Link to="/" className="font-mono text-3xl leading-none font-medium">
              S
            </Link>
          </div>

          <div className="flex items-end justify-between">
            <nav className="flex gap-6 text-sm text-muted-foreground *:font-medium *:hidden *:transition-colors *:hover:text-foreground *:md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger className="items-center gap-1 hover:text-foreground">
                  Browse
                  <ChevronDown className="size-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="*:text-xs">
                  <DropdownMenuItem asChild>
                    <Link to="/">All</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/categories">Categories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tech-stacks">Tech Stack</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/newsletter">Newsletter</Link>
              <Link to="/advertise">Advertise</Link>
            </nav>
            <div className="flex items-center gap-4">
              <MobileNav />
              <AuthSection session={session} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
