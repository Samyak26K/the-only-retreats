import { FooterSection } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Returns & Refunds — The Only Retreats",
};

export default function ReturnsPage() {
  return (
    <>
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 font-display text-4xl tracking-[-0.03em] text-foreground md:text-5xl">
            Returns & Refunds
          </h1>
          <p className="mb-12 text-sm text-muted">Last updated: August 2026</p>

          <div className="space-y-8 font-body leading-7 text-muted">
            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Our Policy
              </h2>
              <p>
                We take great care in sourcing and packing every product. If you
                receive a damaged, defective, or incorrect product, we will
                replace it or issue a full refund. No questions asked.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Eligibility
              </h2>
              <p>To be eligible for a return or refund:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Contact us within 48 hours of receiving your order</li>
                <li>Provide your order number and photographs of the issue</li>
                <li>
                  Products must be unused and in original packaging (for
                  non-defective returns)
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Non-Returnable Items
              </h2>
              <p>
                Due to the perishable nature of our products, we cannot accept
                returns on opened food items unless they are defective or
                damaged on arrival.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Refund Process
              </h2>
              <p>
                Once your return is approved, refunds are processed within 5-7
                business days to your original payment method. Razorpay may take
                additional time to credit the amount to your account.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Contact Us
              </h2>
              <p>
                To initiate a return or refund, contact us at the email address
                listed on our website with your order number and details of the
                issue.
              </p>
            </section>
          </div>
        </div>
      </Container>

      <FooterSection />
    </>
  );
}
