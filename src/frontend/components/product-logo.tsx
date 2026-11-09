export function ProductLogo({
  productName,
  size = "md",
}: {
  productName: string
  size?: "sm" | "md" | "lg"
}) {
  const box = size === "sm" ? "size-6" : size === "lg" ? "size-11" : "size-9"
  const letter = size === "sm" ? "text-[10px]" : size === "lg" ? "text-lg" : "text-sm"

  return (
    <div
      className={`flex items-center justify-center shrink-0 rounded-xl overflow-hidden dark:bg-zinc-50 dark:border dark:border-zinc-200/50 dark:p-0.5 ${box}`}
    >
      <div
        className={`flex rounded bg-surface items-center font-medium justify-center w-full h-full ${letter}`}
      >
        {productName.slice(0, 1)}
      </div>
    </div>
  )
}
