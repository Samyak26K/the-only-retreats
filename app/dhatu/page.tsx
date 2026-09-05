"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { FooterSection } from "@/components/sections/Footer";

export default function DhatuPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<
    Array<{
      id: string;
      name: string;
      slug: string;
      price: number;
      image: string;
      category: string;
    }>
  >([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/dhatu/featured")
      .then((r) => r.json())
      .then((data) => setFeaturedProducts(data.products ?? []))
      .catch(() => {});
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
        <div className="relative flex items-center justify-between px-6 py-4">
          {/* Left: hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center"
          >
            <Menu className="size-5" style={{ color: "#F2EBE0" }} />
          </button>

          {/* Center: wordmark */}
          <Link
            href="/dhatu"
            className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-auto"
          >
            <p
              className="font-sanskrit text-base tracking-wide leading-tight"
              style={{ color: "#F2EBE0" }}
            >
              मूल • धातु
            </p>
            <p
              className="hidden sm:block text-[0.45rem] uppercase tracking-[0.25em]"
              style={{ color: "#B8A98F" }}
            >
              ROOTS AND ORE
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
              <div>
                <span className="font-sanskrit text-lg md:text-xl tracking-wide block">
                  मूल • धातु
                </span>
                <span className="text-[0.55rem] uppercase tracking-[0.3em] block mt-0.5">
                  ROOTS AND ORE
                </span>
              </div>
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
        style={{ height: "100svh", marginTop: "0", paddingTop: "0" }}
      >
        {/* Hero image */}
        <Image
          src="https://res.cloudinary.com/k7cipxug/image/upload/v1787836966/Dhatu-Cook.png"
          alt="Roots and Ore — Handcrafted Heritage"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          style={{ objectPosition: "right center" }}
          sizes="100vw"
        />

        {/* Main left-side scrim */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(20,14,10,0.92) 0%, rgba(20,14,10,0.85) 30%, rgba(20,14,10,0.4) 60%, transparent 85%)",
          }}
        />

        <div
          className="absolute inset-0 z-[1] md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(20,14,10,0.5) 0%, transparent 50%)",
          }}
        />

        {/* Top scrim for navbar legibility */}
        <div
          className="absolute top-0 right-0 left-0 z-[1]"
          style={{
            height: "120px",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          }}
        />

        {/* Hero text — left side */}
        <div className="absolute inset-0 z-[2] flex items-end pb-24 md:items-center md:pb-0">
          <div className="px-6 md:px-12 lg:px-16 max-w-xl">
            <p
              className="text-[0.6rem] uppercase tracking-[0.35em] mb-6"
              style={{ color: "#F2EBE0", opacity: 0.7 }}
            >
              The Only Retreats · Roots &amp; Ore
            </p>
            <div
              className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.02em] mb-6"
              style={{ color: "#F2EBE0" }}
            >
              <p
                className="font-sanskrit text-4xl md:text-5xl lg:text-6xl leading-tight"
                style={{ color: "#F2EBE0" }}
              >
                मूल • धातु
              </p>
              <p
                className="text-sm uppercase tracking-[0.3em] mt-2"
                style={{ color: "#B8A98F" }}
              >
                ROOTS AND ORE
              </p>
            </div>
            <p
              className="text-sm leading-7 mb-3 max-w-sm"
              style={{ color: "#F0E6D8", opacity: 0.85 }}
            >
              Every tribe &amp; art has a story, and some stories are worth
              preserving.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/dhatu/products"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-medium transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#B25B32",
                  color: "#F2EBE0",
                  boxShadow: "0 4px 20px rgba(178,91,50,0.4)",
                }}
              >
                SHOP THE LEGACY
              </Link>
              <Link
                href="#ethos"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.25em] font-medium transition-all hover:opacity-90"
                style={{ border: "1px solid #B8A98F", color: "#F2EBE0" }}
              >
                DISCOVER OUR STORY
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-8 z-[2] flex animate-bounce flex-col items-center gap-2 md:left-12">
          <p
            className="text-[0.5rem] uppercase tracking-[0.3em]"
            style={{ color: "#B8A98F" }}
          >
            Discover
          </p>
          <div className="h-8 w-px" style={{ backgroundColor: "#5A3A2A" }} />
        </div>
      </section>

      {/* Shop by Metal */}
      <section className="py-16" style={{ borderTop: "1px solid #5A3A2A" }}>
        <div className="mb-8 px-6 md:px-12">
          <p
            className="mb-2 text-[0.6rem] uppercase tracking-[0.3em]"
            style={{ color: "#B25B32" }}
          >
            Shop by Metal
          </p>
          <h2
            className="font-display text-3xl md:text-4xl"
            style={{ color: "#F2EBE0" }}
          >
            Choose your element.
          </h2>
        </div>

        <div
          className="flex gap-4 overflow-x-auto px-6 pb-4 md:px-12"
          style={{ scrollbarWidth: "none" }}
        >
          {[
            {
              metal: "Copper",
              hindi: "तांबा",
              subtitle: "Tamra",
              label: "TAMRA • तांबा",
              description: "Antimicrobial. Ayurvedic. Ancient.",
              bg: "#3D1F0F",
              accent: "#B25B32",
              image:
                "https://res.cloudinary.com/k7cipxug/image/upload/v1787842509/Copper.final.png",
              imagePosition: "right center",
            },
            {
              metal: "Brass",
              hindi: "पीतल",
              subtitle: "Pital",
              label: "PITAL • पीतल",
              description: "Durable. Resonant. Timeless.",
              bg: "#2A1F0A",
              accent: "#C89B4A",
              image:
                "https://res.cloudinary.com/k7cipxug/image/upload/v1787842069/Copper.png",
              imagePosition: "right center",
            },
            {
              metal: "Kansa",
              hindi: "कांसा",
              subtitle: "Bronze",
              label: "KANSA • कांसा",
              description: "Bell metal. Sacred. Healing.",
              bg: "#1A2A1F",
              accent: "#7A9E7E",
              image:
                "https://res.cloudinary.com/k7cipxug/image/upload/v1787842069/Kansa.png",
              imagePosition: "right center",
            },
          ].map((item) => (
            <Link
              key={item.metal}
              href={`/dhatu/products?category=${item.metal.toLowerCase()}`}
              className="group relative flex shrink-0 flex-col justify-end overflow-hidden rounded-2xl p-6 transition-transform duration-500 hover:scale-[1.02]"
              style={{
                width: "280px",
                height: "380px",
                border: "1px solid #5A3A2A",
              }}
            >
              {/* Background image - cropped to right side */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.metal}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: item.imagePosition }}
              />

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(20,12,8,0.9) 0%, rgba(20,12,8,0.3) 50%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <p
                  className="mb-2 text-[0.55rem] uppercase tracking-[0.3em]"
                  style={{ color: item.accent }}
                >
                  {item.label}
                </p>
                <h3
                  className="font-display mb-2 text-2xl"
                  style={{ color: "#F2EBE0" }}
                >
                  {item.metal}
                </h3>
                <p
                  className="mb-2 text-[0.6rem] uppercase tracking-[0.2em]"
                  style={{ color: item.accent }}
                >
                  {item.subtitle}
                </p>
                <p
                  className="mb-4 text-xs leading-5"
                  style={{ color: "#B8A98F" }}
                >
                  {item.description}
                </p>
                <span
                  className="text-[0.6rem] uppercase tracking-[0.2em]"
                  style={{ color: item.accent }}
                >
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Core Principles */}
      <section
        className="px-6 py-20 md:px-12"
        style={{ borderTop: "1px solid #5A3A2A" }}
      >
        <div className="mb-12">
          <p
            className="mb-2 text-[0.6rem] uppercase tracking-[0.3em]"
            style={{ color: "#B25B32" }}
          >
            OUR ETHOS
          </p>
          <h2
            id="ethos"
            className="font-display text-3xl md:text-4xl leading-tight mb-8"
            style={{ color: "#F2EBE0" }}
          >
            In a world of mass production, we exist to safeguard the ancient
            Indian art of crafting copper, brass, and bronze.
          </h2>
          <p className="text-sm leading-7 mb-6" style={{ color: "#B8A98F" }}>
            Every vessel we offer is completely handcrafted—shaped by fire, raw
            earth, and human hands. When you bring our cookware into your home,
            you hold the unbroken legacy of the artisans who forged it.
          </p>
          <div className="space-y-3 mt-6">
            {[
              "Shaped by fire, raw earth, and human hands",
              "Every piece completely handcrafted — no machine replication",
              "Direct partnerships with indigenous metalcraft communities",
              "Ancient techniques preserved across generations",
              "Ayurvedic benefits of copper, brass and bronze",
            ].map((point) => (
              <div key={point} className="flex gap-3 items-start">
                <span
                  className="text-sm shrink-0 mt-0.5"
                  style={{ color: "#C89B4A" }}
                >
                  +
                </span>
                <p className="text-sm leading-6" style={{ color: "#B8A98F" }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Artisans */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ borderTop: "1px solid #5A3A2A" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p
              className="text-[0.6rem] uppercase tracking-[0.3em] mb-3"
              style={{ color: "#B25B32" }}
            >
              THE ARTISANS
            </p>
            <h2
              className="font-display text-3xl md:text-4xl leading-tight mb-6"
              style={{ color: "#F2EBE0" }}
            >
              Meet the Makers
            </h2>
            <p
              className="text-sm leading-7 max-w-2xl"
              style={{ color: "#B8A98F" }}
            >
              We partner directly with the indigenous and generational
              metalcraft communities of India to ensure their ancestral fires
              keep burning.
            </p>
          </div>

          <div className="space-y-0">
            {[
              {
                tribe: "THE DHOKRA TRIBE",
                subtitle: "Dhokra Damar & Ghadwa of Bastar",
                description:
                  "The original nomadic metalworkers and guardians of a 4,500-year-old lost-wax casting technique that dates back to the Indus Valley Civilization. Using natural beeswax and river clay, they shape raw brass and bell-metal into intricate designs, preserving the oldest known metal-casting method in the world.",
              },
              {
                tribe: "THE LOHAR & GOND TRIBES",
                subtitle: null,
                description:
                  "The ancient iron-smiths of the Bastar region who practice traditional Loha Shilp. They hand-forge wrought and scrap metal over open coal fires, shaping every piece entirely by hammer without a single weld.",
              },
              {
                tribe: "THE JHĀRA TRIBE",
                subtitle: null,
                description:
                  "Forest-dwelling tribal artisans from central India who have preserved the raw, earthy art of shaping and casting intricate bronze and brass vessels by hand.",
              },
              {
                tribe: "THE KANSARIS",
                subtitle: null,
                description:
                  "Indigenous bell-metal artisans who carry the ancient, elemental alchemy of mixing copper and tin to cast pure Kansa dinnerware for holistic wellness.",
              },
              {
                tribe: "THE TAMBAT",
                subtitle: null,
                description:
                  "Traditional coppersmiths renowned for their hypnotic mathar kaam—the rhythmic, strengthening indentations hammered into copper that serve as the artisan's permanent signature.",
              },
            ].map((artisan, index) => (
              <div
                key={artisan.tribe}
                className="py-8 grid md:grid-cols-[280px_1fr] gap-6 md:gap-12 items-start"
                style={{ borderTop: "1px solid #5A3A2A" }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em] font-medium mb-1"
                    style={{ color: "#C89B4A" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className="font-display text-lg leading-snug"
                    style={{ color: "#F2EBE0" }}
                  >
                    {artisan.tribe}
                  </h3>
                  {artisan.subtitle && (
                    <p
                      className="text-[0.6rem] uppercase tracking-[0.15em] mt-1"
                      style={{ color: "#B25B32" }}
                    >
                      {artisan.subtitle}
                    </p>
                  )}
                </div>
                <p className="text-sm leading-7" style={{ color: "#B8A98F" }}>
                  {artisan.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hands / Craft Editorial */}
      <section
        className="py-20 px-6 md:px-12"
        style={{
          borderTop: "1px solid #5A3A2A",
          backgroundColor: "#241812",
        }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div>
            <p
              className="font-sanskrit text-2xl md:text-3xl"
              style={{ color: "#C89B4A" }}
            >
              अयं मे हस्तो भगवान् ॥
            </p>
            <p className="text-xs mt-3 italic" style={{ color: "#B8A98F" }}>
              In these hands lies the power to create.
            </p>
          </div>

          <div>
            <h2
              className="font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.05em] leading-tight"
              style={{ color: "#F2EBE0" }}
            >
              <span className="block">EVERY GENERATION LEAVES A WITNESS.</span>
              <span className="block mt-1" style={{ color: "#B25B32" }}>
                SOME WITNESSES MUST NOT BE BURIED.
              </span>
            </h2>
          </div>

          <p
            className="font-display italic text-lg md:text-xl leading-snug max-w-xl mx-auto"
            style={{ color: "#B8A98F" }}
          >
            Before it was held in your hands,
            <br />
            it was passed down through theirs.
          </p>

          <div
            className="pt-6 space-y-1"
            style={{ borderTop: "1px solid #5A3A2A" }}
          >
            <p
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: "#C89B4A" }}
            >
              Not manufactured. Only immortalized.
            </p>
            <p
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: "#C89B4A" }}
            >
              Not consumed. Only continued.
            </p>
          </div>
        </div>
      </section>

      {/* Materials / Metals */}
      <section
        className="py-20 px-6 md:px-12"
        style={{ borderTop: "1px solid #5A3A2A" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p
              className="text-[0.6rem] uppercase tracking-[0.3em] mb-3"
              style={{ color: "#B25B32" }}
            >
              THE METALS
            </p>
            <h2
              className="font-display text-3xl md:text-4xl"
              style={{ color: "#F2EBE0" }}
            >
              Know your material.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:border-t border-[#5A3A2A]">
            {[
              {
                sanskrit: "तांबा",
                english: "TAMRA",
                subtitle: "Copper",
                composition: "~99.9% Pure Copper",
                use: "Cold to Room Temp: Ideal for storing overnight drinking water. Never use for hot liquids or cooking.",
                benefit:
                  "Acts as a natural antimicrobial agent. Balances the body's doshas, aids digestion, and boosts daily vitality.",
                accent: "#B25B32",
              },
              {
                sanskrit: "पीतल",
                english: "PITAL",
                subtitle: "Brass",
                composition: "~60-70% Copper + ~30-40% Zinc",
                use: "Medium to Low Heat: Perfect for slow cooking, simmering, and roasting on a stove or hearth.",
                benefit:
                  "Retains up to 90% of food's natural nutrients during cooking. The natural zinc infusion gently supports immune health.",
                accent: "#C89B4A",
              },
              {
                sanskrit: "कांसा",
                english: "KANSA",
                subtitle: "Bronze",
                composition:
                  "~78-80% Copper + ~20-22% Pure Tin (Traditional Bell-Metal ratio)",
                use: "Warm to Room Temp: Strictly for dining and serving plated food. Never place on a direct flame.",
                benefit:
                  "Naturally alkalizes acidic foods to actively aid digestion. Traditionally forged for gut health, immunity, and holistic wellness.",
                accent: "#7A9E7E",
              },
            ].map((metal, index) => (
              <div
                key={metal.english}
                className={`py-10 px-0 md:px-8 space-y-5
                  first:pl-0 last:pr-0
                  border-t md:border-t-0
                  ${index > 0 ? "md:border-l" : ""}
                  border-[#5A3A2A]`}
                style={{}}
              >
                <div>
                  <p
                    className="font-sanskrit text-3xl"
                    style={{ color: metal.accent }}
                  >
                    {metal.sanskrit}
                  </p>
                  <p
                    className="text-[0.6rem] uppercase tracking-[0.3em] mt-1"
                    style={{ color: metal.accent }}
                  >
                    {metal.english} · {metal.subtitle}
                  </p>
                </div>

                <p
                  className="text-[0.65rem] font-mono"
                  style={{ color: "#5A3A2A" }}
                >
                  {metal.composition}
                </p>

                <div>
                  <p
                    className="text-[0.6rem] uppercase tracking-[0.15em] mb-1.5"
                    style={{ color: "#B25B32" }}
                  >
                    Use
                  </p>
                  <p className="text-xs leading-5" style={{ color: "#B8A98F" }}>
                    {metal.use}
                  </p>
                </div>

                <div>
                  <p
                    className="text-[0.6rem] uppercase tracking-[0.15em] mb-1.5"
                    style={{ color: "#B25B32" }}
                  >
                    Traditional Benefits
                  </p>
                  <p className="text-xs leading-5" style={{ color: "#B8A98F" }}>
                    {metal.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Heritage Story */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid #5A3A2A", backgroundColor: "#241812" }}
      >
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
            {/* Left: Story */}
            <div>
              <p
                className="mb-4 text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "#B25B32" }}
              >
                Our Heritage
              </p>
              <h2
                className="font-display mb-8 text-3xl leading-tight md:text-4xl"
                style={{ color: "#F2EBE0" }}
              >
                Welcome heritage
                <br />
                into your home.
              </h2>
              <div className="space-y-5">
                <p className="text-sm leading-7" style={{ color: "#B8A98F" }}>
                  For centuries, Indian artisans have hammered, cast and
                  polished copper and brass into objects of everyday use. These
                  were not luxury items — they were the standard. A brass thali.
                  A copper pot. A kansa bowl.
                </p>
                <p className="text-sm leading-7" style={{ color: "#B8A98F" }}>
                  Somewhere along the way, we replaced them with plastic and
                  stainless steel. Roots &amp; Ore exists to reverse that — to
                  bring Indian metalcraft back into the modern home, with the
                  quality and intention it has always deserved.
                </p>
                <div
                  className="border-l-2 pt-4 pl-5"
                  style={{ borderColor: "#B25B32" }}
                >
                  <p
                    className="text-sm leading-6 italic"
                    style={{ color: "#F2EBE0" }}
                  >
                    &quot;We exist to carry Indian tradition forward — to place
                    it in front of the world with the pride and precision it
                    deserves.&quot;
                  </p>
                  <p
                    className="mt-3 text-[0.6rem] uppercase tracking-[0.2em]"
                    style={{ color: "#B25B32" }}
                  >
                    — Rugved Amdabade, Founder
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-3xl"
              style={{ border: "1px solid #5A3A2A" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/k7cipxug/image/upload/v1787842826/Artisan_Photo.png"
                alt="Indian artisan at work"
                className="h-full w-full object-cover"
                style={{ objectPosition: "center top" }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(26,18,16,0.7) 0%, transparent 60%)",
                }}
              />
              <div className="absolute bottom-6 left-6">
                <p
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: "#B25B32" }}
                >
                  Master Craftsman
                </p>
                <p
                  className="mt-1 text-[0.6rem] uppercase tracking-[0.15em]"
                  style={{ color: "#B8A98F" }}
                >
                  Handcrafted Heritage · Roots &amp; Ore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        className="px-6 py-20 md:px-12"
        style={{ borderTop: "1px solid #5A3A2A" }}
      >
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="mb-2 text-[0.6rem] uppercase tracking-[0.3em]"
              style={{ color: "#B25B32" }}
            >
              Featured
            </p>
            <h2
              className="font-display text-3xl md:text-4xl"
              style={{ color: "#F2EBE0" }}
            >
              Crafted to last.
            </h2>
          </div>
          <Link
            href="/dhatu/products"
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "#B8A98F" }}
          >
            View All →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div
            className="flex gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/dhatu/products/${product.slug}`}
                className="group block shrink-0"
                style={{ width: "220px" }}
              >
                <div
                  className="mb-4 aspect-square overflow-hidden rounded-2xl"
                  style={{
                    backgroundColor: "#241812",
                    border: "1px solid #5A3A2A",
                  }}
                >
                  {product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <p
                        className="font-display text-5xl opacity-20"
                        style={{ color: "#B25B32" }}
                      >
                        ✦
                      </p>
                    </div>
                  )}
                </div>
                <p
                  className="mb-1 text-[0.55rem] uppercase tracking-[0.2em]"
                  style={{ color: "#B25B32" }}
                >
                  {product.category}
                </p>
                <h3
                  className="font-display mb-2 text-base leading-tight"
                  style={{ color: "#F2EBE0" }}
                >
                  {product.name}
                </h3>
                <p className="text-sm" style={{ color: "#C89B4A" }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex gap-5 overflow-x-auto pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="shrink-0 animate-pulse"
                style={{ width: "220px" }}
              >
                <div
                  className="mb-4 aspect-square rounded-2xl"
                  style={{ backgroundColor: "#241812" }}
                />
                <div
                  className="mb-2 h-3 rounded"
                  style={{ backgroundColor: "#241812", width: "60%" }}
                />
                <div
                  className="mb-2 h-4 rounded"
                  style={{ backgroundColor: "#241812", width: "80%" }}
                />
                <div
                  className="h-3 rounded"
                  style={{ backgroundColor: "#241812", width: "40%" }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <FooterSection hideFssai />
    </div>
  );
}
