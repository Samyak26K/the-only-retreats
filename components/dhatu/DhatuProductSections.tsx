"use client";

import { useState } from "react";

type Props = {
  productName: string;
  category: string;
};

function getProductData(name: string, category: string) {
  const isCopper =
    category === "Copper" || name.toLowerCase().includes("copper");
  const isBrass = category === "Brass" || name.toLowerCase().includes("brass");
  const isKansa = category === "Kansa" || name.toLowerCase().includes("kansa");

  const benefits = isCopper
    ? [
        "Naturally antimicrobial — copper inhibits bacterial growth",
        "Ayurvedic tradition recommends copper vessels for water storage",
        "Improves digestion when water is stored overnight in copper",
        "Rich in antioxidants, supports immune function",
        "Naturally regulates water pH when stored in copper",
      ]
    : isBrass
      ? [
          "Brass is an alloy of copper and zinc — naturally antimicrobial",
          "Superior heat conductor — distributes heat evenly while cooking",
          "Naturally non-stick surface develops with use over time",
          "Traditional Indian cooking in brass enhances food's nutritional value",
          "Durable — a well-maintained brass vessel lasts generations",
        ]
      : isKansa
        ? [
            "Kansa (bell metal) is considered the healthiest metal for eating",
            "Alkalizes food naturally — reduces acidity",
            "Ayurvedic texts recommend Kansa for improved digestion",
            "Contains copper and tin — both with antimicrobial properties",
            "The resonant quality of Kansa is considered spiritually significant",
          ]
        : [
            "Handcrafted by master artisans",
            "Traditional Indian metalcraft techniques",
            "Built to last generations",
            "Ayurvedic and wellness benefits",
          ];

  const specs = isCopper
    ? [
        { label: "Material", value: "99.9% Pure Copper" },
        { label: "Finish", value: "Hand-hammered" },
        { label: "Care", value: "Hand wash only" },
        { label: "Origin", value: "India" },
      ]
    : isBrass
      ? [
          { label: "Material", value: "Pure Brass (Copper + Zinc)" },
          { label: "Finish", value: "Hand-crafted" },
          { label: "Surface", value: "Naturally non-stick" },
          { label: "Care", value: "Hand wash, dry immediately" },
          { label: "Origin", value: "India" },
        ]
      : isKansa
        ? [
            { label: "Material", value: "Kansa (Bell Metal — Copper + Tin)" },
            { label: "Finish", value: "Hand-crafted" },
            { label: "Purity", value: "Traditional ratio alloy" },
            { label: "Care", value: "Hand wash, avoid acidic foods" },
            { label: "Origin", value: "India" },
          ]
        : [
            { label: "Material", value: "Traditional Indian Metal" },
            { label: "Finish", value: "Handcrafted" },
            { label: "Origin", value: "India" },
          ];

  const faqs = isCopper
    ? [
        {
          q: "How do I clean copper vessels?",
          a: "Use a mixture of lemon juice and salt, or tamarind paste. Avoid harsh scrubbers. Rinse with warm water and dry immediately. Natural patina that develops over time is normal and safe.",
        },
        {
          q: "Will copper leach into my water?",
          a: "A small amount of copper does leach — this is intentional and beneficial in Ayurvedic practice. However, store water for a maximum of 8 hours. Do not store acidic liquids like juices or milk in copper.",
        },
        {
          q: "Why is my copper vessel turning dark?",
          a: "This is natural oxidation — it is not harmful. Clean with lemon and salt to restore the shine, or leave it as a natural aged patina.",
        },
        {
          q: "Can I use copper for hot beverages?",
          a: "Yes, copper is excellent for hot water and herbal teas. Avoid storing coffee, juice, or other acidic drinks.",
        },
      ]
    : isBrass
      ? [
          {
            q: "How do I season a new brass vessel?",
            a: "Boil water in it twice before first use. Then cook a small amount of rice or dal. The vessel develops a natural non-stick coating with regular use.",
          },
          {
            q: "Can I cook acidic foods in brass?",
            a: "Avoid highly acidic foods like tomatoes, tamarind, or citrus in brass. The acid can react with the metal. For curries with acidic ingredients, use briefly and rinse immediately.",
          },
          {
            q: "How do I clean brass cookware?",
            a: "Use tamarind or lemon with salt for cleaning. Avoid soap if possible — it strips the natural coating. Dry immediately after washing.",
          },
          {
            q: "Is brass safe for cooking?",
            a: "Yes — brass has been used for cooking in India for thousands of years. Ensure you're buying pure brass, not plated products. Ours are 100% pure brass.",
          },
        ]
      : [
          {
            q: "How do I care for Kansa?",
            a: "Hand wash with mild soap and water. Dry immediately. Avoid prolonged contact with acidic foods. Polish with a soft cloth to maintain its natural glow.",
          },
          {
            q: "Can Kansa plates be used daily?",
            a: "Yes — Kansa is recommended for daily use in Ayurveda. The metal naturally alkalizes food and is gentle on digestion.",
          },
        ];

  const origin = isCopper
    ? "Copper craftsmanship in India dates back over 5,000 years. Our copper pieces are made by artisans trained in traditional hammering techniques passed down through generations. Each hammer mark is intentional — a signature of the human hand behind the piece."
    : isBrass
      ? "Brass has been the metal of the Indian kitchen for millennia. Our brass cookware is made using traditional casting and finishing techniques by craftsmen in India's metalworking heartland. No two pieces are identical — each carries the mark of its maker."
      : "Kansa, or bell metal, is one of the most revered materials in Indian tradition. Our Kansa pieces are crafted using the lost-wax casting method, a technique unchanged for thousands of years. Each piece is finished by hand and carries the weight of that history.";

  return { benefits, specs, faqs, origin };
}

export function DhatuProductSections({ productName, category }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { benefits, specs, faqs, origin } = getProductData(
    productName,
    category,
  );

  return (
    <div className="mt-12 space-y-0">
      {/* Section 1: Why You'll Love It + Specs */}
      <section
        className="px-4 py-12 md:px-8"
        style={{ borderTop: "1px solid #5A3A2A" }}
      >
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          {/* Benefits */}
          <div>
            <p
              className="mb-6 text-[0.6rem] uppercase tracking-[0.3em]"
              style={{ color: "#B25B32" }}
            >
              Why You&apos;ll Love It
            </p>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 shrink-0 text-sm"
                    style={{ color: "#C89B4A" }}
                  >
                    +
                  </span>
                  <p className="text-sm leading-6" style={{ color: "#B8A98F" }}>
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div>
            <p
              className="mb-6 text-[0.6rem] uppercase tracking-[0.3em]"
              style={{ color: "#B25B32" }}
            >
              Specifications
            </p>
            <div className="space-y-3">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between py-3"
                  style={{ borderBottom: "1px solid #5A3A2A" }}
                >
                  <p
                    className="text-[0.6rem] uppercase tracking-[0.15em]"
                    style={{ color: "#5A3A2A" }}
                  >
                    {spec.label}
                  </p>
                  <p className="text-sm" style={{ color: "#F2EBE0" }}>
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Heritage Story */}
      <section
        className="px-4 py-12 md:px-8"
        style={{
          borderTop: "1px solid #5A3A2A",
          backgroundColor: "#241812",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <p
            className="mb-4 text-[0.6rem] uppercase tracking-[0.3em]"
            style={{ color: "#B25B32" }}
          >
            Heritage & Origin
          </p>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <p
              className="font-display text-2xl leading-tight md:text-3xl"
              style={{ color: "#F2EBE0" }}
            >
              Not machine made.
              <br />
              <span style={{ color: "#B25B32", fontStyle: "italic" }}>
                Human made.
              </span>
            </p>
            <p className="text-sm leading-7" style={{ color: "#B8A98F" }}>
              {origin}
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Care + FAQ Accordion */}
      <section
        className="px-4 py-12 md:px-8"
        style={{ borderTop: "1px solid #5A3A2A" }}
      >
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-8 text-[0.6rem] uppercase tracking-[0.3em]"
            style={{ color: "#B25B32" }}
          >
            Care & FAQ
          </p>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl"
                style={{ border: "1px solid #5A3A2A" }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors"
                  style={{
                    backgroundColor: openFaq === i ? "#241812" : "transparent",
                  }}
                >
                  <p className="pr-4 text-sm" style={{ color: "#F2EBE0" }}>
                    {faq.q}
                  </p>
                  <span
                    className="shrink-0 text-lg leading-none"
                    style={{ color: "#B25B32" }}
                  >
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i ? (
                  <div
                    className="px-5 pb-4"
                    style={{ backgroundColor: "#241812" }}
                  >
                    <p
                      className="text-sm leading-6"
                      style={{ color: "#B8A98F" }}
                    >
                      {faq.a}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
