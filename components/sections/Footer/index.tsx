import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/sections/Footer/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { footerContent } from "@/lib/content/footer";

export function FooterSection() {
  return (
    <footer
      id="contact"
      className="pt-20 pb-10"
      style={{
        backgroundColor: "#1a2a1f",
        backgroundImage: "url('/topo.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "600px 600px",
      }}
    >
      <Container>
        <div className="space-y-16">
          {/* Brand block */}
          <div className="max-w-lg space-y-4">
            <Image
              src="/logo.png"
              alt="The Only Retreats"
              width={48}
              height={48}
              className="object-contain mb-4"
              style={{ filter: "brightness(0) invert(1) opacity(0.8)" }}
            />
            <p className="text-xs uppercase tracking-[0.28em] text-gold/60">
              THE ONLY RETREATS
            </p>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] text-white/90 md:text-4xl">
              {footerContent.brand.name}
            </h2>
            <p className="max-w-sm font-body text-base leading-7 text-white/40">
              {footerContent.brand.mission}
            </p>
            <p className="mt-2 max-w-xs text-xs leading-5 text-white/30">
              Dedicated to preserving the world&apos;s most meaningful
              traditions of nourishment, wellness and intentional living.
            </p>
          </div>

          {/* Three column grid */}
          <div className="grid gap-12 md:grid-cols-3">
            {/* Explore */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.28em] text-white/30">
                {footerContent.explore.title}
              </h3>
              <ul className="space-y-3">
                {footerContent.explore.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.28em] text-white/30">
                {footerContent.contact.title}
              </h3>
              <ul className="space-y-3">
                {footerContent.contact.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-base text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.28em] text-white/30">
                {footerContent.newsletter.title}
              </h3>
              <p className="text-sm leading-6 text-white/40">
                {footerContent.newsletter.description}
              </p>
              <NewsletterForm
                placeholder={footerContent.newsletter.placeholder}
                buttonText={footerContent.newsletter.buttonText}
              />
            </div>
          </div>

          {/* Bottom */}
          <div className="space-y-4 border-t border-white/10 pt-8">
            <div className="flex flex-wrap gap-6">
              <Link
                href="/terms"
                className="text-xs text-white/30 transition-colors hover:text-white/60"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs text-white/30 transition-colors hover:text-white/60"
              >
                Privacy Policy
              </Link>
              <Link
                href="/returns"
                className="text-xs text-white/30 transition-colors hover:text-white/60"
              >
                Returns & Refunds
              </Link>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/20">
                {footerContent.bottom.copyright}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/20">
                {footerContent.bottom.madeIn}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
