import { Hono } from "hono"

import type { AppEnv } from "./types"
import { v1 } from "./routes/v1"

export const api = new Hono<AppEnv>().route("/api/v1", v1)

export type AppType = typeof api
export type V1Api = typeof v1
