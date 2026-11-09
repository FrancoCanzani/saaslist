import { getRouteApi } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"

import { Button } from "@components/ui/button"
import { Field, TextInput } from "@components/ui/field"
import { authClient } from "@lib/auth/client"
import { safeInternalPath } from "@lib/safe-internal-path"

const routeApi = getRouteApi("/sign-in")

const DEV_SIGN_IN_EMAIL = "francocanzani@gmail.com"

export function SignInPage() {
  const search = routeApi.useSearch()
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function sendCode(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const normalized = email.trim().toLowerCase()
    if (import.meta.env.DEV && normalized === DEV_SIGN_IN_EMAIL) {
      const response = await fetch("/api/v1/auth/dev-sign-in", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      })
      if (response.ok) {
        window.location.assign(safeInternalPath(search.redirect))
        return
      }
      if (response.status !== 404) {
        setPending(false)
        setError("Could not sign in.")
        return
      }
    }
    const result = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    })
    setPending(false)
    if (result.error) {
      setError(result.error.message ?? "Could not send the code")
      return
    }
    setStep("code")
  }

  async function verify(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    const result = await authClient.signIn.emailOtp({ email, otp })
    setPending(false)
    if (result.error) {
      setError(result.error.message ?? "That code did not work")
      return
    }
    window.location.assign(safeInternalPath(search.redirect))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="mb-4 flex justify-center">
          <div className="font-mono text-7xl font-bold text-foreground">S</div>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-medium text-foreground">Join SaasList</h1>
        </div>
        {step === "email" ? (
          <form className="space-y-3" onSubmit={sendCode}>
            <Field label="Email">
              <TextInput
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="h-12 w-full rounded-sm text-base font-normal dark:grayscale"
            >
              {pending ? "Sending…" : "Email me a code"}
            </Button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={verify}>
            <Field label={`Code for ${email}`}>
              <TextInput
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
              />
            </Field>
            {import.meta.env.DEV ? (
              <p className="text-sm text-muted-foreground">
                In development the code is printed in the server log.
              </p>
            ) : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              className="h-12 w-full rounded-sm text-base font-normal dark:grayscale"
            >
              {pending ? "Checking…" : "Sign in"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
