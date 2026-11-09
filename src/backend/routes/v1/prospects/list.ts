import { desc } from "drizzle-orm"
import { Hono } from "hono"

import { prospect } from "../../../db/schema"
import { createDb } from "../../../lib/db"
import { requireEditor } from "../../../middleware/session"
import type { AppEnv } from "../../../types"
import { serializeProspect } from "./lib/serialize"

export const listProspects = new Hono<AppEnv>().get(
  "/",
  requireEditor,
  async (c) => {
    const db = createDb(c.env)
    const rows = await db
      .select()
      .from(prospect)
      .orderBy(desc(prospect.createdAt))

    return c.json({ prospects: rows.map(serializeProspect) })
  },
)
