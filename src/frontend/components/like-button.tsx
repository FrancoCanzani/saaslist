import { Heart } from "lucide-react"
import { useState, type MouseEvent } from "react"

import { api } from "@lib/api"
import { cn } from "@lib/utils"

export function LikeButton({
  slug,
  likeCount,
  liked,
  onChange,
}: {
  slug: string
  likeCount: number
  liked: boolean
  onChange?: (next: { likeCount: number; liked: boolean }) => void
}) {
  const [pending, setPending] = useState(false)

  async function toggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (pending) {
      return
    }

    const previous = { likeCount, liked }
    const optimistic = {
      liked: !liked,
      likeCount: Math.max(0, likeCount + (liked ? -1 : 1)),
    }
    onChange?.(optimistic)
    setPending(true)
    const response = await api.products[":slug"].like.$post({
      param: { slug },
    })
    setPending(false)

    if (response.status === 401) {
      onChange?.(previous)
      const next = `${window.location.pathname}${window.location.search}`
      window.location.assign(`/sign-in?redirect=${encodeURIComponent(next)}`)
      return
    }

    if (!response.ok) {
      onChange?.(previous)
      return
    }

    const body = (await response.json()) as {
      likeCount: number
      liked: boolean
    }
    onChange?.(body)
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      disabled={pending}
      onClick={(event) => void toggle(event)}
      className={cn(
        "flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
        pending && "opacity-70",
      )}
    >
      <Heart className={cn("size-3.5", liked && "fill-red-600 text-red-600")} />
      <span className="tabular-nums">{likeCount}</span>
    </button>
  )
}
