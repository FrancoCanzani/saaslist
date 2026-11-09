function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

export function outreachMessage(input: {
  productName: string
  source: string
  sourceUrl: string
  origin: string
}) {
  const text = [
    "Hi,",
    "",
    "I run SaasList, a reviewed directory of bootstrapped software.",
    `I saw ${input.productName} on ${input.source}: ${input.sourceUrl}`,
    "",
    "If you want a page in the directory, reply to this email and I will send a draft for you to approve. A person reviews every listing. This is the only email I will send unless you reply.",
    "",
    "SaasList",
    input.origin,
  ].join("\n")

  const html = text
    .split("\n\n")
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br />")}</p>`)
    .join("")

  return {
    subject: `${input.productName} on SaasList`,
    text,
    html,
  }
}
