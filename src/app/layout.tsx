import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/lib/query-client-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "SaasList - Discover & Share SaaS Products",
  description:
    "A Product Hunt for SaaS products. Discover, share, and upvote the best SaaS tools.",
  openGraph: {
    title: "SaasList - Discover & Share SaaS Products",
    description:
      "A Product Hunt for SaaS products. Discover, share, and upvote the best SaaS tools.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "SaasList - Discover & Share SaaS Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaasList - Discover & Share SaaS Products",
    description:
      "A Product Hunt for SaaS products. Discover, share, and upvote the best SaaS tools.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${crimsonPro.variable} antialiased dark:bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <QueryProvider>
              {children}
              <Toaster />
              <Analytics />
            </QueryProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  );
}
