import type { ReactNode } from "react"

import { Footer } from "./footer"
import { Header } from "./header"

export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <main className="flex w-full flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
