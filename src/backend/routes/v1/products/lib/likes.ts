import type { Context } from "hono"
import { eq } from "drizzle-orm"

import { productLike } from "../../../../db/schema"
import { createAuth } from "../../../../lib/auth"
import type { Database } from "../../../../lib/db"
import type { AppEnv } from "../../../../types"

export async function viewerId(c: Context<AppEnv>) {
  const payload = await createAuth(c.env, c.executionCtx).api.getSession({
    headers: c.req.raw.headers,
  })
  return payload?.user.id ?? null
}

export async function likedIds(db: Database, userId: string | null) {
  if (!userId) {
    return new Set<string>()
  }

  const rows = await db
    .select({ productId: productLike.productId })
    .from(productLike)
    .where(eq(productLike.userId, userId))

  return new Set(rows.map((row) => row.productId))
}
