import type { MiddlewareHandler } from "hono"

import { isEditor } from "../lib/editor"
import { createAuth } from "../lib/auth"
import type { AppEnv } from "../types"

export const requireSession: MiddlewareHandler<AppEnv> = async (c, next) => {
  const payload = await createAuth(c.env, c.executionCtx).api.getSession({
    headers: c.req.raw.headers,
  })

  if (!payload) {
    return c.json({ error: "unauthorized" as const }, 401)
  }

  c.set("user", payload.user)
  c.set("session", payload.session)
  await next()
}

export const requireEditor: MiddlewareHandler<AppEnv> = async (c, next) => {
  const payload = await createAuth(c.env, c.executionCtx).api.getSession({
    headers: c.req.raw.headers,
  })

  if (!payload) {
    return c.json({ error: "unauthorized" as const }, 401)
  }

  if (!isEditor(c.env, payload.user.email)) {
    return c.json({ error: "forbidden" as const }, 403)
  }

  c.set("user", payload.user)
  c.set("session", payload.session)
  await next()
}
