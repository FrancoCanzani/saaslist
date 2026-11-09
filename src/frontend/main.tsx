import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@components/theme-provider"
import { routeTree } from "./route-tree.gen"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
})

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    session: null,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingMs: 200,
  defaultPendingMinMs: 0,
  scrollRestoration: true,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const rootEl = document.getElementById("root")
if (!rootEl) {
  throw new Error("Missing root element")
}

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
