import { Container } from "@/components/ui/Container";
import { FooterSection } from "@/components/sections/Footer";

export const metadata = {
  title: "Cookie Policy — The Only Retreats",
};

export default function CookiePage() {
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
            Cookie Policy
          </h1>
          <p className="text-sm text-muted mb-12">Last updated: August 2026</p>

          <div className="space-y-8 font-body text-muted leading-7">
            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                What Are Cookies
              </h2>
              <p>
                Cookies are small text files stored on your device when you
                visit a website. They help the website remember your preferences
                and improve your experience.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Cookies We Use
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">
                    Essential cookies:
                  </strong>{" "}
                  Required for the website to function — shopping cart,
                  authentication session, and checkout flow. Cannot be disabled.
                </li>
                <li>
                  <strong className="text-foreground">
                    Preference cookies:
                  </strong>{" "}
                  Store your wishlist and saved preferences using localStorage.
                </li>
                <li>
                  <strong className="text-foreground">
                    Analytics cookies:
                  </strong>{" "}
                  We may use basic analytics to understand how visitors use our
                  site. No personally identifying data is collected.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Third-Party Cookies
              </h2>
              <p>
                Our payment provider Razorpay and authentication provider Clerk
                may set their own cookies as part of their services. These are
                governed by their respective privacy policies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-heading text-xl text-foreground">
                Managing Cookies
              </h2>
              <p>
                You can control cookies through your browser settings. Note that
                disabling essential cookies may affect the functionality of this
                website, including the ability to add items to your cart or
                complete checkout.
              </p>
            </section>
          </div>
        </div>
      </Container>
      <FooterSection />
    </>
  );
}
