import { Container } from "@/components/ui/Container";
import { FooterSection } from "@/components/sections/Footer";

export const metadata = {
  title: "Shipping Policy — The Only Retreats",
};

export default function ShippingPage() {
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
            Shipping Policy
          </h1>
          <p className="text-sm text-muted mb-12">Last updated: August 2026</p>

          <div className="space-y-8 font-body text-muted leading-7">
            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Processing Time
              </h2>
              <p>
                All orders are processed within 2–3 business days after payment
                confirmation. Orders placed on weekends or public holidays will
                be processed on the next business day.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Delivery Timelines
              </h2>
              <p>
                We currently ship across India. Estimated delivery timelines
                after dispatch:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad,
                  Kolkata): 3–5 business days
                </li>
                <li>Tier 2 & Tier 3 cities: 5–7 business days</li>
                <li>Remote and rural areas: 7–10 business days</li>
              </ul>
              <p>
                These are estimates and may vary due to courier conditions,
                weather or public holidays.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Shipping Partners
              </h2>
              <p>
                We ship via Delhivery and other reliable courier partners
                depending on your location. Tracking details will be shared via
                email once your order is dispatched.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Shipping Charges
              </h2>
              <p>
                Shipping is free on all orders currently. This may change in
                future — any applicable charges will be clearly displayed at
                checkout before payment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Failed Deliveries
              </h2>
              <p>
                If a delivery attempt fails due to an incorrect address or
                unavailability, the courier will attempt redelivery. If delivery
                fails after multiple attempts, the order may be returned to us.
                In such cases, please contact us to arrange reshipment.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">Contact</h2>
              <p>
                For shipping queries, contact us at customer@theonlyretreats.com
                or +91 9225181202.
              </p>
            </section>
          </div>
        </div>
      </Container>
      <FooterSection />
    </>
  );
}
