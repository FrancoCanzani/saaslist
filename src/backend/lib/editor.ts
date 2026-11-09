export function isEditor(env: Env, email: string) {
  const allowed = env.EDITOR_EMAILS.split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0)

  if (allowed.length === 0) {
    return env.ENVIRONMENT === "development"
  }

  return allowed.includes(email.toLowerCase())
}

export function dailySendCap(env: Env) {
  const parsed = Number.parseInt(env.DAILY_SEND_CAP, 10)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 20
  }
  return parsed
}
