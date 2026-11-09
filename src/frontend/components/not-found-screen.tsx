import { PageFrame } from "@components/page-frame"

export function NotFoundScreen() {
  return (
    <PageFrame>
      <div className="w-full p-6 py-16">
        <h1 className="text-xl font-medium">That page is not in the directory.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          It may still be in review, or the address is wrong.
        </p>
      </div>
    </PageFrame>
  )
}
