import { Hono } from "hono"

import type { AppEnv } from "../../../types"
import { createProspect } from "./create"
import { listProspects } from "./list"
import { updateProspect } from "./update"

export const prospects = new Hono<AppEnv>()
  .route("/", listProspects)
  .route("/", createProspect)
  .route("/", updateProspect)
