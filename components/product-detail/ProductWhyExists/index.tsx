import Image from "next/image";

import { Container } from "@/components/ui/Container";
import type { Product } from "@/lib/content/product";

type Props = {
  product: Product;
};

export function ProductWhyExists({ product }: Props) {
  const isHoney = product.category === "honey";

  const whyText = {
    heading: isHoney
      ? "Why This Honey Exists"
      : `Why This ${product.name} Exists`,
    eyebrow: "FROM THE HIMALAYAS",
    paragraphs: [
      product.story.body ||
        "Most products in the market are blended, processed, and filtered multiple times.",
      `Our ${product.name} is raw, unprocessed, and sourced from a single Himalayan region.`,
      "Pure, rare and true to its origin.",
    ],
    valleyImage: "/images/valleys/lahaul.webp",
    badgeNumber: "18",
    badgeText: "HIMALAYAN BEEKEEPER FAMILIES",
    shloka: {
      devanagari: product.shloka.devanagari || "मधु वाता ऋतायते",
      translation: product.shloka.translation || "May the winds be sweet.",
      reference: "RIG VEDA (MADHU SUKTA)",
      wisdom:
        "For the Vedic seers, sweetness was not merely a taste — it was a way of describing harmony between nature, seasons, rivers, forests, and life itself.",
    },
  };

  return (
    <section className="border-t border-border bg-background py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          <div className="flex flex-col justify-center space-y-5">
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              {whyText.eyebrow}
            </p>
            <h2 className="font-display text-2xl leading-tight tracking-[-0.02em] text-foreground md:text-3xl">
              {whyText.heading}
            </h2>
            <div className="space-y-3">
              {whyText.paragraphs.map((para, i) => (
                <p key={i} className="text-sm leading-6 text-muted">
                  {para}
                </p>
              ))}
            </div>
            <a
              href="#product-story"
              className="mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.15em] text-foreground transition-colors hover:text-gold"
            >
              Know More →
            </a>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-auto md:min-h-[280px]">
            <Image
              src={whyText.valleyImage}
              alt="Himalayan valley"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            <div className="absolute bottom-4 left-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-border bg-background/90 p-2 text-center">
              <span className="font-display text-xl leading-none text-foreground">
                {whyText.badgeNumber}
              </span>
              <span className="mt-0.5 text-[0.45rem] leading-tight uppercase tracking-wide text-muted">
                {whyText.badgeText}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-gold/20 bg-[#f5f0e4] p-6 text-center">
            <p className="text-[0.55rem] uppercase tracking-[0.2em] text-muted">
              — श्लोक / SLOKA —
            </p>

            <p
              lang="sa"
              className="font-sanskrit text-lg leading-relaxed text-foreground md:text-xl"
            >
              {whyText.shloka.devanagari}
            </p>

            <p className="max-w-[200px] text-xs leading-5 text-muted italic">
              {whyText.shloka.translation}
            </p>

            <p className="text-[0.55rem] uppercase tracking-[0.15em] text-muted/60">
              — {whyText.shloka.reference}
            </p>

            <div className="w-full space-y-2 border-t border-gold/20 pt-4">
              <p className="font-heading text-xs font-medium text-foreground">
                Why This Wisdom
              </p>
              <p className="text-[0.7rem] leading-5 text-muted">
                {whyText.shloka.wisdom}
              </p>
            </div>

            <div className="mt-2 text-lg text-gold/40">✦</div>
          </div>
        </div>
      </Container>
    </section>
  );
}
