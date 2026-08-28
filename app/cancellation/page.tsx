import { Container } from "@/components/ui/Container";
import { FooterSection } from "@/components/sections/Footer";

export const metadata = {
  title: "Cancellation Policy — The Only Retreats",
};

export default function CancellationPage() {
  return (
    <>
      <div
        className="h-(--navbar-height-mobile) 
        md:h-(--navbar-height-tablet) 
        lg:h-(--navbar-height-desktop)"
      />
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p
            className="text-[0.6rem] uppercase tracking-[0.24em] 
            text-gold mb-4"
          >
            Legal
          </p>
          <h1
            className="font-display text-4xl md:text-5xl 
            tracking-[-0.03em] text-foreground mb-4"
          >
            Cancellation Policy
          </h1>
          <p className="text-sm text-muted mb-12">Last updated: August 2026</p>

          <div className="space-y-8 font-body text-muted leading-7">
            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Order Cancellation
              </h2>
              <p>
                You may cancel your order within 24 hours of placing it,
                provided it has not yet been dispatched. To cancel, contact us
                immediately at customer@theonlyretreats.com or +91 9225181202
                with your order number.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                After Dispatch
              </h2>
              <p>
                Once an order has been dispatched, it cannot be cancelled. You
                may initiate a return after delivery as per our Returns &
                Refunds policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Cancellation by The Only Retreats
              </h2>
              <p>
                We reserve the right to cancel any order in the following
                circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product is out of stock after order placement</li>
                <li>Payment could not be verified</li>
                <li>Incorrect pricing due to a technical error</li>
                <li>Delivery is not possible to the provided address</li>
              </ul>
              <p>
                In all such cases, a full refund will be issued within 5–7
                business days.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Refund on Cancellation
              </h2>
              <p>
                Approved cancellations will be refunded to the original payment
                method within 5–7 business days. Razorpay processing time may
                add an additional 1–2 business days.
              </p>
            </section>
          </div>
        </div>
      </Container>
      <FooterSection />
    </>
  );
}
