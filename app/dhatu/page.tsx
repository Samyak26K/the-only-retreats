"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FooterSection } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";

export default function DhatuPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: "#1A1210" }} className="min-h-screen">
      {/* Fixed Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(26,18,16,0.97)" : "transparent",
          borderBottom: scrolled
            ? "1px solid #5A3A2A"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center"
          >
            <Menu className="size-5" style={{ color: "#F2EBE0" }} />
          </button>

          {/* Center: wordmark */}
          <Link href="/dhatu" className="text-center">
            <p
              className="font-display text-lg tracking-[0.4em] uppercase"
              style={{ color: "#F2EBE0" }}
            >
              Dhatu
            </p>
            <p
              className="text-[0.45rem] uppercase tracking-[0.25em]"
              style={{ color: "#B8A98F" }}
            >
              by The Only Retreats
            </p>
          </Link>

          {/* Right: cart */}
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center"
          >
            <ShoppingBag className="size-5" style={{ color: "#F2EBE0" }} />
          </Link>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(26,18,16,0.8)" }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute top-0 bottom-0 left-0 flex w-72 flex-col p-8"
            style={{
              backgroundColor: "#1A1210",
              borderRight: "1px solid #5A3A2A",
            }}
          >
            <div className="mb-12 flex items-center justify-between">
              <p
                className="font-display text-lg tracking-[0.3em]"
                style={{ color: "#F2EBE0" }}
              >
                Dhatu
              </p>
              <button type="button" onClick={() => setMenuOpen(false)}>
                <X className="size-5" style={{ color: "#B8A98F" }} />
              </button>
            </div>
            <nav className="space-y-6">
              {[
                { label: "Collection", href: "/dhatu/products" },
                {
                  label: "Copper Bottles",
                  href: "/dhatu/products?category=copper-bottles",
                },
                {
                  label: "Cookware",
                  href: "/dhatu/products?category=cookware",
                },
                {
                  label: "Serveware",
                  href: "/dhatu/products?category=serveware",
                },
                { label: "Ritual", href: "/dhatu/products?category=ritual" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base tracking-[0.2em] uppercase"
                  style={{ color: "#B8A98F" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div
              className="mt-auto pt-8"
              style={{ borderTop: "1px solid #5A3A2A" }}
            >
              <Link
                href="/"
                className="text-xs tracking-[0.2em] uppercase"
                style={{ color: "#5A3A2A" }}
              >
                ← The Only Retreats
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HERO — Full viewport */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* Hero image */}
        <Image
          src="https://res.cloudinary.com/k7cipxug/image/upload/v1787754301/DhatuFinal.png"
          alt="Dhatu — Handcrafted Heritage"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          style={{ objectPosition: "right center" }}
          sizes="100vw"
        />

        {/* Subtle left gradient for text readability */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(26,18,16,0.75) 0%, rgba(26,18,16,0.3) 50%, transparent 100%)",
          }}
        />

        {/* Hero text — left side */}
        <div className="absolute inset-0 z-[2] flex items-center">
          <div className="max-w-xl px-6 md:px-12 lg:px-16">
            <p
              className="mb-6 text-[0.6rem] uppercase tracking-[0.35em]"
              style={{ color: "#B25B32" }}
            >
              The Only Retreats · Dhatu
            </p>
            <h1
              className="font-display mb-6 text-5xl leading-[0.92] tracking-[-0.02em] md:text-6xl lg:text-7xl"
              style={{ color: "#F2EBE0" }}
            >
              Timeless
              <br />
              Metals.
              <br />
              <span style={{ color: "#B25B32", fontStyle: "italic" }}>
                Thoughtful
                <br />
                Living.
              </span>
            </h1>
            <p
              className="mb-10 max-w-sm text-sm leading-7"
              style={{ color: "#B8A98F" }}
            >
              Handcrafted copper and brass rooted in centuries of Indian artisan
              tradition. Not mass produced. Only preserved.
            </p>
            <Link
              href="/dhatu/products"
              className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs font-medium tracking-[0.25em] uppercase transition-all hover:opacity-90"
              style={{ backgroundColor: "#B25B32", color: "#F2EBE0" }}
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 animate-bounce">
          <p
            className="text-[0.5rem] uppercase tracking-[0.3em]"
            style={{ color: "#B8A98F" }}
          >
            Discover
          </p>
          <div className="h-8 w-px" style={{ backgroundColor: "#5A3A2A" }} />
        </div>
      </section>

      {/* Categories strip */}
      <section
        className="overflow-x-auto py-8"
        style={{ borderBottom: "1px solid #5A3A2A" }}
      >
        <div className="flex min-w-max gap-3 px-6 md:px-12">
          {[
            "All",
            "Copper Bottles",
            "Cookware",
            "Serveware",
            "Decor",
            "Ritual",
          ].map((cat) => (
            <Link
              key={cat}
              href={`/dhatu/products?category=${cat.toLowerCase().replace(" ", "-")}`}
              className="rounded-full border px-5 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase transition-all hover:border-[#B25B32] hover:text-[#B25B32]"
              style={{ borderColor: "#5A3A2A", color: "#B8A98F" }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Why Dhatu */}
      <section className="px-6 py-20 md:px-12">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
            <div>
              <p
                className="mb-4 text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "#B25B32" }}
              >
                Why Dhatu
              </p>
              <h2
                className="font-display mb-8 text-3xl leading-tight md:text-4xl"
                style={{ color: "#F2EBE0" }}
              >
                100% Pure.
                <br />
                Naturally Better.
              </h2>
              <div className="space-y-5">
                {[
                  "Sourced from master craftsmen across India",
                  "Traditional techniques passed down generations",
                  "No machine replication — every piece is unique",
                  "Ayurvedic benefits of copper and brass",
                  "Built to last a lifetime, not a season",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-4">
                    <span
                      className="mt-0.5 shrink-0 text-sm"
                      style={{ color: "#C89B4A" }}
                    >
                      +
                    </span>
                    <p
                      className="text-sm leading-6"
                      style={{ color: "#B8A98F" }}
                    >
                      {point}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/dhatu/products"
                className="mt-10 inline-flex items-center gap-3 rounded-full border px-8 py-4 text-xs tracking-[0.2em] uppercase transition-all hover:border-[#B25B32] hover:bg-[#B25B32] hover:text-[#F2EBE0]"
                style={{ borderColor: "#B25B32", color: "#B25B32" }}
              >
                Shop the Collection
              </Link>
            </div>

            {/* Sanskrit mark */}
            <div
              className="flex aspect-square flex-col items-center justify-center rounded-3xl"
              style={{
                backgroundColor: "#241812",
                border: "1px solid #5A3A2A",
              }}
            >
              <p className="font-display text-8xl" style={{ color: "#B25B32" }}>
                धातु
              </p>
              <p
                className="mt-4 text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "#5A3A2A" }}
              >
                Element · Metal · Essence
              </p>
              <div className="mt-8 px-8 text-center">
                <p
                  className="text-xs leading-6 italic"
                  style={{ color: "#B8A98F" }}
                >
                  &quot;In Vedic tradition, dhatu are the seven essential
                  elements that sustain life. We bring that essence to your
                  home.&quot;
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section
        className="px-6 py-20 text-center"
        style={{
          borderTop: "1px solid #5A3A2A",
          backgroundColor: "#241812",
        }}
      >
        <p
          className="mb-4 text-[0.6rem] uppercase tracking-[0.3em]"
          style={{ color: "#B25B32" }}
        >
          Crafted to Last
        </p>
        <h2
          className="font-display mb-6 text-4xl md:text-5xl"
          style={{ color: "#F2EBE0" }}
        >
          Every piece tells a story.
        </h2>
        <p
          className="mx-auto mb-10 max-w-md text-sm"
          style={{ color: "#B8A98F" }}
        >
          Not mass produced. Only preserved.
        </p>
        <Link
          href="/dhatu/products"
          className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs font-medium tracking-[0.25em] uppercase transition-all hover:opacity-80"
          style={{ backgroundColor: "#B25B32", color: "#F2EBE0" }}
        >
          Explore Dhatu
        </Link>
      </section>

      <FooterSection />
    </div>
  );
}
