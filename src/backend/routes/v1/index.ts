import { Hono } from "hono"

import type { AppEnv } from "../../types"
import { categoryRoutes } from "./categories"
import { health } from "./health"
import { me } from "./me"
import { products } from "./products"
import { prospects } from "./prospects"
import { review } from "./review"

export const v1 = new Hono<AppEnv>()
  .route("/health", health)
  .route("/me", me)
  .route("/categories", categoryRoutes)
  .route("/products", products)
  .route("/review", review)
  .route("/prospects", prospects)
