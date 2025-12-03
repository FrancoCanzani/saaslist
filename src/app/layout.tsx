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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "saaslist - A curated directory of bootstrapped SaaS tools",
    template: "%s | saaslist",
  },
  description:
    "A curated directory bootstrapped SaaS tools built by independent founders and small teams.",
  keywords: [
    "bootstrapped SaaS",
    "indie SaaS",
    "SaaS tools",
    "founder-built",
    "independent SaaS",
    "bootstrapped products",
    "small team SaaS",
  ],
  authors: [{ name: "saaslist" }],
  creator: "saaslist",
  publisher: "saaslist",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "saaslist",
    title: "saaslist - A curated directory of bootstrapped SaaS tools",
    description:
      "A curated directory bootstrapped SaaS tools built by independent founders and small teams.",
    images: [
      {
        url: new URL("/opengraph-image", baseUrl).toString(),
        width: 1200,
        height: 630,
        alt: "saaslist - A curated directory of bootstrapped SaaS tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "saaslist - A curated directory of bootstrapped SaaS tools",
    description:
      "A curated directory bootstrapped SaaS tools built by independent founders and small teams.",
    images: [new URL("/opengraph-image", baseUrl).toString()],
  },
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        className={`${inter.variable} ${crimsonPro.variable} antialiased bg-surface/20 dark:bg-background`}
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
