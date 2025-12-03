import type { Metadata } from "next";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Terms of Service | saaslist",
  description: "saaslist terms of service. Read our terms and conditions for using our platform.",
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
};


export default function TermsPage() {
  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto py-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-medium tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SaasList, you accept and agree to be bound by these
              Terms of Service. If you do not agree, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">2. Use of Service</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Not use the service for illegal purposes</li>
              <li>Not submit spam, false, or misleading content</li>
              <li>Respect intellectual property rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">3. Product Submissions</h2>
            <p>
              When you submit a product, you represent that you have the right to do so and
              that the content is accurate. You grant us a license to display, distribute,
              and promote your product listing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">4. Subscriptions and Payments</h2>
            <p>
              Subscription fees are processed through Stripe. By purchasing a subscription,
              you agree to the pricing and billing terms.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">European Union Customers</h3>
              <p className="text-sm">
                If you are located in the European Union, you have enhanced consumer rights
                under EU law. However, subscription cancellations may be subject to refund
                policies. Please contact us at{" "}
                <a href="mailto:support@saaslist.com" className="underline">
                  support@saaslist.com
                </a>{" "}
                to request cancellation and discuss refund eligibility. Refunds will be
                processed in accordance with applicable EU consumer protection laws.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">5. Cancellation and Refunds</h2>
            <p>
              You may cancel your subscription at any time through your account settings.
              Cancellation will take effect at the end of your current billing period.
            </p>
            <p className="mt-4">
              <strong>Refund Policy:</strong> Refunds are available within 14 days of
              purchase for EU customers in accordance with EU consumer protection laws.
              Non-EU customers are not eligible for refunds unless required by local law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              All content on SaasList, including text, graphics, logos, and software, is the
              property of SaasList or its content suppliers and is protected by copyright and
              other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              SaasList is provided "as is" without warranties of any kind. We are not liable
              for any damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">8. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the
              service at our sole discretion, without prior notice, for conduct that we
              believe violates these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">9. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. We will notify users of material changes.
              Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mt-8 mb-4">10. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@saaslist.com" className="underline">
                legal@saaslist.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

