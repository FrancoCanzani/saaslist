import { Link, getRouteApi } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"

import { api } from "@lib/api"
import { authClient } from "@lib/auth/client"

const rootApi = getRouteApi("__root__")

export function SiteHeader() {
  const { session } = rootApi.useRouteContext()
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

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="text-lg tracking-tight">
          SaasList
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <Link to="/categories" className="hover:text-ink">
            Categories
          </Link>
          <Link to="/submit" className="hover:text-ink">
            Submit
          </Link>
          {session ? (
            <Link to="/mine" className="hover:text-ink">
              Mine
            </Link>
          ) : null}
          {me.data?.editor ? (
            <>
              <Link to="/review" className="hover:text-ink">
                Review
              </Link>
              <Link to="/outreach" className="hover:text-ink">
                Outreach
              </Link>
            </>
          ) : null}
          {session ? (
            <button
              type="button"
              className="hover:text-ink"
              onClick={() => {
                void authClient.signOut().then(() => {
                  window.location.assign("/")
                })
              }}
            >
              Sign out
            </button>
          ) : (
            <Link to="/sign-in" className="hover:text-ink">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
