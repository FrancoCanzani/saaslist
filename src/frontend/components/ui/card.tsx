import type { ComponentProps } from "react"

import { cn } from "@lib/utils"

function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "text-card-foreground flex bg-background border py-6 rounded-lg border-border/50 hover:border-border transition-all duration-200 hover:bg-surface/80 group flex-col gap-3 p-3",
        className,
      )}
      {...props}
    />
  )
}

export { Card }
