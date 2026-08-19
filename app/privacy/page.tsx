import { FooterSection } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Privacy Policy — The Only Retreats",
};

export default function PrivacyPage() {
  return (
    <>
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 font-display text-4xl tracking-[-0.03em] text-foreground md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mb-12 text-sm text-muted">Last updated: August 2026</p>

          <div className="space-y-8 font-body leading-7 text-muted">
            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                1. Information We Collect
              </h2>
              <p>
                When you place an order, we collect your name, email address,
                phone number, and shipping address. We use this information
                solely to process and deliver your order.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                2. How We Use Your Information
              </h2>
              <p>
                Your information is used to: process your order, communicate
                order status, deliver your products, and respond to your
                enquiries. We do not sell or share your personal data with third
                parties except as required to fulfill your order (e.g. shipping
                partners).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                3. Payment Security
              </h2>
              <p>
                All payments are processed by Razorpay. We do not store your
                card or payment details on our servers. Razorpay is PCI-DSS
                compliant and handles all payment data securely.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                4. Cookies
              </h2>
              <p>
                We use essential cookies to maintain your shopping cart session.
                We do not use tracking or advertising cookies without your
                consent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                5. Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your
                personal data at any time by contacting us. We will respond
                within 30 days.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                6. Contact
              </h2>
              <p>
                For privacy-related queries, contact us at the email address
                listed on our website.
              </p>
            </section>
          </div>
        </div>
      </Container>

      <FooterSection />
    </>
  );
}
