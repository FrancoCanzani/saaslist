# SaasList

Reviewed directory of bootstrapped software. Vite, React, Hono, and Cloudflare D1.

## Local

```bash
cp .dev.vars.example .dev.vars
bun install
bun run db:migrate:dev
bun run dev
```

Sign-in codes are printed in the dev server log. With `EDITOR_EMAILS` empty and `ENVIRONMENT=development`, any signed-in user can review and send outreach.

## Production

Set `ENVIRONMENT` to `production`, point `BETTER_AUTH_URL` and `EMAIL_FROM` at the real domain, and set `EDITOR_EMAILS` to a comma-separated allowlist.

```bash
wrangler secret put BETTER_AUTH_SECRET
bun run db:migrate
bun run deploy
```

Outreach mail is sent only in production, and only after a prospect is marked ready. The daily cap is `DAILY_SEND_CAP`.
