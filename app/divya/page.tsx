"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function DivyaPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ backgroundColor: "#FAF5EC" }} className="min-h-screen">
      {/* Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(250,245,236,0.97)" : "transparent",
          borderBottom: scrolled
            ? "1px solid #B07428"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-[0.6rem] uppercase tracking-[0.2em]"
            style={{ color: "#B07428" }}
          >
            ← The Only Retreats
          </Link>
          <Link href="/divya" className="text-center">
            <p
              className="font-display text-lg tracking-[0.4em] uppercase"
              style={{ color: "#2C1810" }}
            >
              Divya
            </p>
            <p
              className="text-[0.45rem] uppercase tracking-[0.25em]"
              style={{ color: "#B07428" }}
            >
              by The Only Retreats
            </p>
          </Link>
          <Link
            href="/cart"
            className="text-[0.6rem] uppercase tracking-[0.2em]"
            style={{ color: "#B07428" }}
          >
            Cart
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100svh" }}
      >
        {/* Hero image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/k7cipxug/image/upload/v1787847450/Divya_hero.png"
          alt="Divya — Sacred traditions. Living rituals."
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "right center" }}
          fetchPriority="high"
        />

        {/* Top scrim for navbar */}
        <div
          className="absolute top-0 right-0 left-0 z-[1]"
          style={{
            height: "120px",
            background:
              "linear-gradient(to bottom, rgba(250,245,236,0.5) 0%, transparent 100%)",
          }}
        />

        {/* Left gradient for text */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(250,245,236,0.85) 0%, rgba(250,245,236,0.5) 40%, rgba(250,245,236,0.1) 65%, transparent 100%)",
          }}
        />

        {/* Hero text */}
        <div className="absolute inset-0 z-[2] flex items-center">
          <div className="relative max-w-xl px-6 md:px-12 lg:px-16">
            {/* Ghost watermark */}
            <p
              className="font-display pointer-events-none absolute top-1/2 right-8 hidden -translate-y-1/2 leading-none select-none md:block"
              style={{
                fontSize: "18vw",
                color: "#B07428",
                opacity: 0.04,
              }}
            >
              दिव्य
            </p>

            <p
              className="relative z-10 mb-6 text-[0.6rem] uppercase tracking-[0.35em]"
              style={{ color: "#B07428" }}
            >
              The Only Retreats · Divya
            </p>
            <h1
              className="font-display relative z-10 mb-6 text-5xl leading-[0.92] tracking-[-0.02em] md:text-6xl lg:text-7xl"
              style={{ color: "#2C1810" }}
            >
              Sacred traditions.
              <br />
              <span style={{ color: "#6A2434", fontStyle: "italic" }}>
                Living rituals.
              </span>
            </h1>
            <p
              className="relative z-10 mb-10 max-w-sm text-sm leading-7"
              style={{ color: "#5A3D28" }}
            >
              Puja essentials, Ayurvedic wellness and aromatic rituals rooted in
              Vedic tradition. Brought to your home with the same intention they
              were made in.
            </p>
            <Link
              href="/divya/products"
              className="relative z-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-xs font-medium tracking-[0.25em] uppercase transition-all hover:opacity-90"
              style={{
                backgroundColor: "#6A2434",
                color: "#FAF5EC",
                boxShadow: "0 4px 20px rgba(106,36,52,0.3)",
              }}
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-8 z-[2] flex flex-col items-center gap-2">
          <p
            className="text-[0.5rem] uppercase tracking-[0.3em]"
            style={{ color: "#B07428" }}
          >
            Discover
          </p>
          <div
            className="h-8 w-px animate-bounce"
            style={{ backgroundColor: "#B07428", opacity: 0.5 }}
          />
        </div>
      </section>

      {/* Category filter bar */}
      <section
        className="sticky top-16 z-30 px-6 py-6 md:px-12"
        style={{
          backgroundColor: "#FAF5EC",
          borderBottom: "1px solid #B07428",
          borderTop: "1px solid #B07428",
        }}
      >
        <div
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {[
            "All",
            "Ritual & Puja",
            "Ayurvedic Skincare",
            "Panchagavya Wellness",
            "Dhoop & Aromatherapy",
          ].map((cat) => (
            <Link
              key={cat}
              href={`/divya/products?category=${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
              className="shrink-0 rounded-full border px-5 py-2 text-xs tracking-[0.15em] uppercase transition-all hover:border-[#6A2434] hover:bg-[#6A2434] hover:text-[#FAF5EC]"
              style={{
                borderColor: "#B07428",
                color: "#8A7560",
                backgroundColor: "transparent",
              }}
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Brand statement */}
      <section
        className="px-6 py-20 md:px-12"
        style={{ borderBottom: "1px solid #B07428" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="font-display text-3xl leading-relaxed italic md:text-4xl"
            style={{ color: "#2C1810" }}
          >
            &quot;Not mass produced.
            <br />
            Only preserved.&quot;
          </p>
          <div
            className="mx-auto my-6 h-px w-12"
            style={{ backgroundColor: "#B07428" }}
          />
          <p
            className="mx-auto max-w-xl text-sm leading-7"
            style={{ color: "#8A7560" }}
          >
            Every product in Divya comes from a practice that existed before the
            modern world. We don&apos;t manufacture wellness — we source it from
            the traditions that invented it.
          </p>
        </div>
      </section>

      {/* Categories preview */}
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-6xl space-y-24">
          {[
            {
              name: "Ritual & Puja",
              hindi: "पूजा",
              description:
                "Havan kits, puja essentials and sacred items for daily ritual practice.",
              image:
                "https://res.cloudinary.com/k7cipxug/image/upload/v1787903827/Ritual_Puja_Category_Banner.png",
              href: "/divya/products?category=ritual-puja",
              products: ["Nano Havan", "Havan Samagri", "Havan Powder"],
            },
            {
              name: "Ayurvedic Skincare",
              hindi: "आयुर्वेद",
              description:
                "Handcrafted soaps and preparations rooted in Ayurvedic tradition.",
              image:
                "https://res.cloudinary.com/k7cipxug/image/upload/v1787903831/Ayurvedic_Skincare_Category_Banner.png",
              href: "/divya/products?category=ayurvedic-skincare",
              products: ["De-Tan Soap", "Ubtan Soap"],
            },
            {
              name: "Panchagavya Wellness",
              hindi: "पञ्चगव्य",
              description:
                "Products from the five gifts of the cow — ancient Indian wellness.",
              image:
                "https://res.cloudinary.com/k7cipxug/image/upload/v1787903911/Panchagavya_Wellness_Category_Banne.png",
              href: "/divya/products?category=panchagavya-wellness",
              products: [
                "Shuddh Gau-Ghrit",
                "Divya Dhara Roll-On",
                "Nabhi Tel",
              ],
            },
            {
              name: "Dhoop & Aromatherapy",
              hindi: "धूप",
              description:
                "Sambrani, dhoop and aromatic preparations for sacred spaces.",
              image:
                "https://res.cloudinary.com/k7cipxug/image/upload/v1787903994/Dhoop_Aromatherapy_Category_Banner.png",
              href: "/divya/products?category=dhoop-aromatherapy",
              products: [
                "Guggal Sambrani Cup",
                "Chandan Sambrani Cup",
                "Gulab Sambrani Cup",
              ],
            },
          ].map((category, index) => (
            <div key={category.name}>
              {/* Category header */}
              <div className="relative mb-8">
                <p
                  className="font-display pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 leading-none select-none"
                  style={{
                    fontSize: "9vw",
                    color: "#B07428",
                    opacity: 0.05,
                  }}
                >
                  {category.hindi}
                </p>
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <p
                      className="mb-1 text-[0.6rem] uppercase tracking-[0.3em]"
                      style={{ color: "#B07428" }}
                    >
                      {category.name}
                    </p>
                    <p
                      className="max-w-sm text-sm"
                      style={{ color: "#8A7560" }}
                    >
                      {category.description}
                    </p>
                  </div>
                  <Link
                    href={category.href}
                    className="ml-8 shrink-0 text-xs tracking-[0.2em] uppercase underline-offset-4 hover:underline"
                    style={{ color: "#6A2434" }}
                  >
                    View All →
                  </Link>
                </div>
              </div>

              {/* Category layout - alternating */}
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                {/* Image - alternates left/right */}
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${index % 2 === 1 ? "md:order-2" : ""}`}
                  style={{ border: "1px solid #D4B896" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(250,245,236,0.4) 0%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Product list */}
                <div
                  className={`space-y-4 ${index % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <p
                    className="text-[0.6rem] uppercase tracking-[0.2em]"
                    style={{ color: "#B07428" }}
                  >
                    In this category
                  </p>
                  <div className="space-y-2">
                    {category.products.map((productName) => (
                      <div
                        key={productName}
                        className="flex items-center justify-between py-3"
                        style={{ borderBottom: "1px solid #D4B896" }}
                      >
                        <div className="flex items-center gap-3">
                          <span style={{ color: "#B07428" }}>✦</span>
                          <p
                            className="font-display text-base"
                            style={{ color: "#2C1810" }}
                          >
                            {productName}
                          </p>
                        </div>
                        <span className="text-xs" style={{ color: "#B07428" }}>
                          →
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={category.href}
                    className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs tracking-[0.2em] uppercase transition-all hover:opacity-90"
                    style={{
                      backgroundColor: "#6A2434",
                      color: "#FAF5EC",
                    }}
                  >
                    Explore {category.name}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer simple */}
      <section
        className="px-6 py-12 text-center"
        style={{ borderTop: "1px solid #B07428" }}
      >
        <Link
          href="/"
          className="text-xs tracking-[0.2em] uppercase"
          style={{ color: "#B07428" }}
        >
          ← Back to The Only Retreats
        </Link>
      </section>
    </div>
  );
}
