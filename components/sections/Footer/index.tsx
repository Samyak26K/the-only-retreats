import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { footerContent } from "@/lib/content/footer";

export function FooterSection() {
  return (
    <Section id="contact" background="surface">
      <Container>
        <div className="space-y-16 lg:space-y-20">
          {/* Brand block */}
          <div className="space-y-4 lg:space-y-6">
            <h2 className="font-display text-[clamp(1.5rem,2.5vw,2rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
              {footerContent.brand.name}
            </h2>
            <p className="font-body text-base leading-7 text-muted/90 sm:text-lg sm:leading-8 max-w-2xl">
              {footerContent.brand.mission}
            </p>
          </div>

          {/* Three-column grid */}
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Explore */}
            <div className="space-y-6">
              <h3 className="font-sanskrit text-[0.75rem] uppercase tracking-[0.28em] text-muted sm:text-sm">
                {footerContent.explore.title}
              </h3>
              <ul className="space-y-3">
                {footerContent.explore.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-base leading-6 text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h3 className="font-sanskrit text-[0.75rem] uppercase tracking-[0.28em] text-muted sm:text-sm">
                {footerContent.contact.title}
              </h3>
              <ul className="space-y-3">
                {footerContent.contact.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-base leading-6 text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="font-sanskrit text-[0.75rem] uppercase tracking-[0.28em] text-muted sm:text-sm">
                {footerContent.newsletter.title}
              </h3>
              <p className="font-body text-sm leading-6 text-muted/90 max-w-xs">
                {footerContent.newsletter.description}
              </p>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder={footerContent.newsletter.placeholder}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted/50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {footerContent.newsletter.buttonText}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom section */}
          <div className="space-y-6 border-t border-border pt-8">
            <p className="font-body text-sm text-muted/90">
              {footerContent.bottom.copyright}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/terms"
                className="text-xs text-muted/70 transition-colors hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-muted/70 transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/returns"
                className="text-xs text-muted/70 transition-colors hover:text-foreground"
              >
                Returns & Refunds
              </Link>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-sanskrit text-[0.75rem] uppercase tracking-[0.24em] text-muted">
                {footerContent.bottom.madeIn}
              </p>
              <p className="font-body text-sm text-muted/90">
                {footerContent.bottom.closing}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
