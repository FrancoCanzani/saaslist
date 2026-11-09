import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context, location }) => {
    if (!context.session) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      })
    }
    return { session: context.session }
  },
  component: Outlet,
})
