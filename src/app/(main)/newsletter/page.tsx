import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";
import { getCurrentUser } from "@/features/profiles/api";

export default async function NewsletterPage() {
  const { user, profile } = await getCurrentUser();

  return (
    <main className="p-6 space-y-8 max-w-2xl mx-auto py-12">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-medium font-mono tracking-tight">
          Weekly Drops
        </h2>
        <p className="text-pretty text-sm text-muted-foreground">
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
