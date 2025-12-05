"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

interface FooterProps {
  containerClassName?: string;
}

export default function Footer({
  containerClassName,
}: {
  containerClassName?: string;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="border-t border-dashed dark:border-surface border-surface">
      <div className={cn("max-w-6xl mx-auto p-6", containerClassName)}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-mono font-medium text-xl">SaasList</h3>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="size-4 block dark:hidden" />
              <Moon className="size-4 hidden dark:block" />
              <span className="sr-only">Toggle theme</span>
            </button>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/browse"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/products/new"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Submit Product
                </Link>
              </li>
              <li>
                <Link
                  href="/newsletter"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/advertise"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/saaslist-vs-producthunt"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  SaasList vs Product Hunt
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/product-launch-checklist"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Launch Checklist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
