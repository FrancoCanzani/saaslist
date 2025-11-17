import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Privacy Policy | SaasList",
  description: "SaasList privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto py-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-medium tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul>
              <li>Account information (name, email address)</li>
              <li>Product submissions and related content</li>
              <li>Comments, reviews, and other user-generated content</li>
              <li>Payment information processed through Stripe</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Send you newsletters and updates (with your consent)</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Detect and prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">3. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li>Service providers (e.g., Stripe for payments, Supabase for hosting)</li>
              <li>Legal authorities when required by law</li>
              <li>Other users as part of public product listings</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">4. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:privacy@saaslist.com" className="underline">
                privacy@saaslist.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">5. Cookies</h2>
            <p>
              We use cookies and similar technologies to track activity and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate
              when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your
              personal information. However, no method of transmission over the Internet is
              100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">7. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              changes by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">9. Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at{" "}
              <a href="mailto:privacy@saaslist.com" className="underline">
                privacy@saaslist.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

