import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  )
}

const controlClass =
  "rounded-md border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-accent"

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={controlClass} {...props} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} min-h-28`} {...props} />
}

export function SelectInput({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={controlClass} {...props}>
      {children}
    </select>
  )
}
