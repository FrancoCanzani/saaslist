import { getRouteApi } from "@tanstack/react-router"
import { useState, type FormEvent } from "react"

import { Button } from "@components/ui/button"
import { Field, TextInput } from "@components/ui/field"
import { authClient } from "@lib/auth/client"
import { safeInternalPath } from "@lib/safe-internal-path"

const routeApi = getRouteApi("/sign-in")

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
    <div className="mx-auto max-w-md">
      <h1 className="text-3xl tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        We email you a code. No password.
      </p>
      {step === "email" ? (
        <form className="mt-8 flex flex-col gap-4" onSubmit={sendCode}>
          <Field label="Email">
            <TextInput
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Email me a code"}
          </Button>
        </form>
      ) : (
        <form className="mt-8 flex flex-col gap-4" onSubmit={verify}>
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
            <p className="text-sm text-muted">
              In development the code is printed in the server log.
            </p>
          ) : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Checking…" : "Sign in"}
          </Button>
        </form>
      )}
    </div>
  )
}
