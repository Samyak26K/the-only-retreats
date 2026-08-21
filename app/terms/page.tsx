import { FooterSection } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Terms of Service — The Only Retreats",
};

export default function TermsPage() {
  return (
    <>
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 font-display text-4xl tracking-[-0.03em] text-foreground md:text-5xl">
            Terms of Service
          </h1>
          <p className="mb-12 text-sm text-muted">Last updated: August 2026</p>

          <div className="space-y-8 font-body leading-7 text-muted">
            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                1. Agreement
              </h2>
              <p>
                By accessing this website and placing an order with The Only
                Retreats, you agree to these Terms of Service. If you do not
                agree, please do not use the site.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                2. Products
              </h2>
              <p>
                We source small-batch Himalayan products. Availability may vary
                with season and harvest. Descriptions, images, and origin
                details are provided in good faith and may be updated as new
                information is verified.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                3. Orders & Payment
              </h2>
              <p>
                Orders are confirmed only after successful payment. We accept
                payments through Razorpay. Prices are listed in Indian Rupees
                and include applicable taxes unless stated otherwise.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                4. Shipping
              </h2>
              <p>
                We ship across India. Delivery timelines depend on destination
                and courier partner. Risk of loss passes to you upon delivery to
                the address provided at checkout.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                5. Returns
              </h2>
              <p>
                Returns and refunds are governed by our Returns & Refunds
                policy. Please review that page before placing an order.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                6. Intellectual Property
              </h2>
              <p>
                All content on this website — including text, photography,
                logos, and design — is owned by The Only Retreats and may not be
                used without permission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                7. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, The Only Retreats is not
                liable for indirect or consequential losses arising from use of
                this website or our products, except where required by
                applicable consumer protection law.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                8. Contact
              </h2>
              <p>
                For questions about these terms, contact us through the details
                listed in the website footer.
              </p>
            </section>
          </div>
        </div>
      </Container>

      <FooterSection />
    </>
  );
}
