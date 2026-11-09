import type { ComponentProps, ReactNode } from "react"

const controlClass =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props: ComponentProps<"input">) {
  return <input className={controlClass} {...props} />
}

export function TextArea(props: ComponentProps<"textarea">) {
  return <textarea className={`${controlClass} min-h-28 py-2`} {...props} />
}

export function SelectInput({
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <select className={controlClass} {...props}>
      {children}
    </select>
  )
}
