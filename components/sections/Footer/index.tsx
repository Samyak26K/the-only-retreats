import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/sections/Footer/NewsletterForm";
import { Container } from "@/components/ui/Container";
import { footerContent } from "@/lib/content/footer";

export function FooterSection({
  hideFssai = false,
}: { hideFssai?: boolean } = {}) {
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
              <Link
                href="/shipping"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Shipping Policy
              </Link>
              <Link
                href="/cancellation"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Cancellation Policy
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
            <div
              className="border-t pt-8 mt-6 space-y-6"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              {/* FSSAI + Company Info row */}
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
                {/* FSSAI Logo */}
                {!hideFssai ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="https://res.cloudinary.com/k7cipxug/image/upload/v1787843837/FSSAI-License-Mandatory-for-Small-Business-300x232-removebg-preview.png"
                    alt="FSSAI Licensed"
                    className="h-12 w-auto object-contain opacity-90 shrink-0"
                  />
                ) : null}

                {/* Company Information */}
                <div className="space-y-1">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/50 mb-2">
                    Company Information
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                    {[
                      ["Company", "Rugvedic Ventures Private Limited"],
                      ["Brand", "The Only Retreats"],
                      ["CIN", "U46909PN2026PTC256344"],
                      ["PAN", "AAPCR9493J"],
                      ["FSSAI Reg. No.", "21526037004345"],
                      ["Location", "Pune, Maharashtra, India"],
                    ].map(([label, value]) => (
                      <p
                        key={label}
                        className="text-xs text-white/60 leading-5"
                      >
                        <span className="text-white/40 mr-1">{label}:</span>
                        {value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regulatory details */}
              <div
                className="space-y-2 pt-4 border-t"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-xs text-white/60 leading-6">
                  <span className="text-white/40">FSSAI License No.:</span>{" "}
                  21526037004345
                </p>
                <p className="text-xs text-white/60 leading-6">
                  <span className="text-white/40">Marketed by:</span> The Only
                  Retreats (Brand of Rugvedic Ventures)
                </p>
                <p className="text-xs text-white/60 leading-6 max-w-2xl">
                  <span className="text-white/40">Packed & Procured by:</span>{" "}
                  Rugvedic Ventures Pvt. Ltd, Highland Space, Moshi, Haveli,
                  Pune 412105, Maharashtra
                </p>
                <p className="text-xs text-white/60 leading-6">
                  <span className="text-white/40">Consumer Care:</span>{" "}
                  <a
                    href="mailto:customer@theonlyretreats.com"
                    className="transition-colors hover:text-white"
                  >
                    customer@theonlyretreats.com
                  </a>{" "}
                  ·{" "}
                  <a
                    href="tel:+919172778248"
                    className="transition-colors hover:text-white"
                  >
                    +91 9172778248
                  </a>{" "}
                  /{" "}
                  <a
                    href="tel:+919225181202"
                    className="transition-colors hover:text-white"
                  >
                    +91 9225181202
                  </a>
                </p>
              </div>

              {/* Copyright row */}
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <p className="text-xs text-white/40">
                  © 2026 The Only Retreats. All rights reserved.
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Made in India
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
