type WaitUntilCtx = {
  waitUntil: (promise: Promise<unknown>) => void
}

export async function sendAppEmail(
  env: Env,
  ctx: WaitUntilCtx | undefined,
  message: {
    to: string
    subject: string
    text: string
    html: string
    devLine: string
    replyTo?: string
  },
) {
  if (env.ENVIRONMENT !== "production") {
    console.log(message.devLine)
    return { delivered: false as const }
  }

  const sending = env.EMAIL.send({
    from: env.EMAIL_FROM,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html,
    ...(message.replyTo ? { replyTo: message.replyTo } : {}),
  }).then(() => ({ delivered: true as const }))

  if (ctx) {
    ctx.waitUntil(sending)
    return { delivered: true as const }
  }

  return sending
}
