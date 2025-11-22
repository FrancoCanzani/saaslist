"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useProfile } from "@/features/profiles/queries"
import { formatDate } from "date-fns"
import { Globe } from "lucide-react"
import { useState } from "react"


export function FounderHoverCard({
  userId,
  children,
}: {
    userId: string
    children: React.ReactNode
  }) {
    
  const [isOpen, setIsOpen] = useState(false)
  const { data: profile, isLoading } = useProfile(userId, isOpen)

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <HoverCard onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-xs text-muted-foreground">Loading...</div>
          </div>
        ) : profile ? (
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold">
                  {profile.name || "User"}
                </h4>
                {(profile.twitter || profile.website) && (
                  <div className="flex gap-1.5 shrink-0">
                    {profile.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        title="Twitter"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="size-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                        title="Website"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="text-muted-foreground text-xs">
                Joined {formatDate(new Date(profile.created_at), "MMMM yyyy")}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Profile not available
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

