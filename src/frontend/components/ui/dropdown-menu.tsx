import { Menu } from "@base-ui/react/menu"
import type { ComponentProps, ReactElement, ReactNode } from "react"

import { cn } from "@lib/utils"

function DropdownMenu(props: ComponentProps<typeof Menu.Root>) {
  return <Menu.Root {...props} />
}

function DropdownMenuTrigger({
  className,
  render,
  ...props
}: ComponentProps<typeof Menu.Trigger> & { render?: ReactElement }) {
  return (
    <Menu.Trigger
      className={cn("inline-flex items-center", className)}
      render={render}
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  align = "center",
  sideOffset = 4,
  children,
}: {
  className?: string
  align?: "start" | "center" | "end"
  sideOffset?: number
  children: ReactNode
}) {
  return (
    <Menu.Portal>
      <Menu.Positioner align={align} sideOffset={sideOffset} className="z-50">
        <Menu.Popup
          className={cn(
            "min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground",
            className,
          )}
        >
          {children}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  )
}

const itemClass =
  "relative flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"

function DropdownMenuItem({
  className,
  render,
  children,
  ...props
}: ComponentProps<typeof Menu.Item> & { render?: ReactElement }) {
  if (render) {
    return (
      <Menu.LinkItem
        className={cn(itemClass, className)}
        closeOnClick
        render={render}
      >
        {children}
      </Menu.LinkItem>
    )
  }

  return (
    <Menu.Item className={cn(itemClass, className)} {...props}>
      {children}
    </Menu.Item>
  )
}

function DropdownMenuLabel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <Menu.Group>
      <Menu.GroupLabel className={cn("px-2 py-1.5 text-sm font-medium", className)}>
        {children}
      </Menu.GroupLabel>
    </Menu.Group>
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <Menu.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} />
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
}
