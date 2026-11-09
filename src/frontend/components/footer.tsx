import { Link } from "@tanstack/react-router"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@lib/utils"

export function Footer({
  containerClassName,
}: {
  containerClassName?: string
}) {
  const { theme, setTheme } = useTheme()

  return (
    <footer className="border-t border-dashed border-surface dark:border-surface">
      <div className={cn("mx-auto max-w-6xl p-6", containerClassName)}>
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-mono text-xl font-medium">SaasList</h3>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="block size-4 dark:hidden" />
              <Moon className="hidden size-4 dark:block" />
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  to="/submit"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Submit Product
                </Link>
              </li>
              <li>
                <Link
                  to="/newsletter"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/advertise"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/$slug"
                  params={{ slug: "saaslist-vs-producthunt" }}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  SaasList vs Product Hunt
                </Link>
              </li>
              <li>
                <Link
                  to="/blog/$slug"
                  params={{ slug: "product-launch-checklist" }}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Launch Checklist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
