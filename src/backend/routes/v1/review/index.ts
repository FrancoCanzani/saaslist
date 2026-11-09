import { Hono } from "hono"

import type { AppEnv } from "../../../types"
import { reviewProducts } from "./products"

export const review = new Hono<AppEnv>().route("/products", reviewProducts)
