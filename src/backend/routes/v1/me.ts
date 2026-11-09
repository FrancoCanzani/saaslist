import { Hono } from "hono"

import { isEditor } from "../../lib/editor"
import { requireSession } from "../../middleware/session"
import type { AppEnv } from "../../types"

export const me = new Hono<AppEnv>().get("/", requireSession, (c) => {
  const current = c.get("user")
  return c.json({
    user: {
      id: current.id,
      email: current.email,
      name: current.name,
    },
    editor: isEditor(c.env, current.email),
  })
})
