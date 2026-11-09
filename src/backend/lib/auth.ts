import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth"
import { emailOTP } from "better-auth/plugins"

import * as schema from "../db/schema"
import { createDb } from "./db"
import { deliverOtp } from "./otp"
import { AUTH_BASE_PATH } from "./paths"

type WaitUntilCtx = {
  waitUntil: (promise: Promise<unknown>) => void
}

export function createAuth(env: Env, ctx?: WaitUntilCtx) {
  const db = createDb(env)

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    basePath: AUTH_BASE_PATH,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.BETTER_AUTH_URL],
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema,
    }),
    emailAndPassword: {
      enabled: false,
    },
    rateLimit: {
      enabled: env.ENVIRONMENT === "production",
    },
    advanced: {
      useSecureCookies: env.ENVIRONMENT === "production",
    },
    databaseHooks: {
      user: {
        create: {
          before: async (nextUser) => {
            const name = nextUser.name?.trim()
            if (name) {
              return { data: nextUser }
            }
            const local = nextUser.email.split("@")[0]?.trim()
            return {
              data: {
                ...nextUser,
                name: local && local.length > 0 ? local : "Founder",
              },
            }
          },
        },
      },
    },
    plugins: [
      emailOTP({
        storeOTP: "hashed",
        async sendVerificationOTP({ email, otp, type }) {
          await deliverOtp(env, ctx, { email, otp, type })
        },
      }),
    ],
  })
}

export type Auth = ReturnType<typeof createAuth>
