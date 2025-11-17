import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";
import { getCurrentUser } from "@/features/profiles/api";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Weekly Drops Newsletter | SaasList",
  description:
    "Get the best SaaS products of the week delivered to your inbox every Sunday. Stay updated with the latest tools and innovations.",
  alternates: {
    canonical: `${baseUrl}/newsletter`,
  },
};

export default async function NewsletterPage() {
  const { user, profile } = await getCurrentUser();

  return (
    <main className="p-6 space-y-8 max-w-2xl mx-auto py-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-medium tracking-tight">Weekly Drops</h1>
        <p className="text-sm text-muted-foreground">
          Get the best products of the week delivered to your inbox every Sunday
        </p>
      </div>

      <NewsletterForm
        defaultName={profile?.name || ""}
        defaultEmail={profile?.email || ""}
        isLoggedIn={!!user && !!profile?.email}
      />
    </main>
  );
}
