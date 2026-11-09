import { Hono } from "hono"

import type { AppEnv } from "../../../types"
import { createProduct } from "./create"
import { getProduct } from "./get"
import { listProducts } from "./list"
import { mine } from "./mine"

export const products = new Hono<AppEnv>()
  .route("/", mine)
  .route("/", listProducts)
  .route("/", createProduct)
  .route("/", getProduct)
