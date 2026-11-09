import { Outlet } from "@tanstack/react-router"

import { SiteHeader } from "@components/site-header"

export function RootLayout() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
