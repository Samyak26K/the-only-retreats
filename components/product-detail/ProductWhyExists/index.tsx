"use client";

import { useState } from "react";
import Image from "next/image";

import { Container } from "@/components/ui/Container";
import type { Product } from "@/lib/content/product";

type Props = {
  product: Product;
};

export function ProductWhyExists({ product }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isGhee =
    product.slug.includes("ghee") ||
    product.name.toLowerCase().includes("ghee");
  const isHoney =
    product.slug.includes("honey") ||
    product.name.toLowerCase().includes("honey");
  const isCoffee = product.slug.includes("coffee");
  const isShilajit = product.slug.includes("shilajit");
  const isSeabuckthorn =
    product.slug.includes("sea-buckthorn") ||
    product.slug.includes("buckthorn");

  const whyText = isGhee
    ? {
        heading: "Why This Ghee Exists",
        eyebrow: "FROM THE HIMALAYAS",
        paragraphs: [
          "Most ghee in the market is made from commercial dairy — pasteurised milk, industrial churning, mass production.",
          "Our ghee is made the Bilona way. Curd churned by hand. Butter slow-clarified over wood fire. From cows that graze freely at altitude.",
          "The process takes five days. The difference is in every spoonful.",
        ],
        valleyImage: "/images/valleys/kullu.webp",
        badgeNumber: "5",
        badgeText: "DAY PROCESS",
        shloka: {
          devanagari: product.shloka?.devanagari ?? "गावो विश्वस्य मातरः",
          translation:
            product.shloka?.translation ??
            "The cow is the mother of the world.",
          reference: "ATHARVA VEDA",
          wisdom:
            "In Vedic tradition, the cow is considered sacred not for religious reasons alone — but because she gives life. Milk, curd, ghee, fuel, medicine. The ancient economy of a village flowed through her.",
        },
      }
    : isHoney
      ? {
          heading: "Why This Honey Exists",
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
            translation:
              product.shloka.translation || "May the winds be sweet.",
            reference: "RIG VEDA (MADHU SUKTA)",
            wisdom:
              "For the Vedic seers, sweetness was not merely a taste — it was a way of describing harmony between nature, seasons, rivers, forests, and life itself.",
          },
        }
      : isCoffee
        ? {
            heading: "Why This Coffee Exists",
            eyebrow: "FROM THE HIMALAYAS",
            paragraphs: [
              "Coffee grown at altitude develops more slowly. The cold nights, the thin air, the mineral-rich soil — all of it concentrates in the bean.",
              "Himalayan coffee is not mass cultivated. It grows in small plots, at elevations where most crops cannot survive.",
              "Each batch is small. Each cup carries the character of where it was grown.",
            ],
            valleyImage: "/images/valleys/kullu.webp",
            badgeNumber: "∞",
            badgeText: "SMALL BATCH",
            shloka: {
              devanagari: "प्रकृतिः सर्वस्य",
              translation: "Nature is the source of everything.",
              reference: "VEDIC TRADITION",
              wisdom:
                "The mountains do not rush. Neither does good coffee. Patience is the only ingredient that cannot be manufactured.",
            },
          }
        : isShilajit
          ? {
              heading: "Why This Shilajit Exists",
              eyebrow: "FROM THE HIMALAYAS",
              paragraphs: [
                "Shilajit is not manufactured. It is collected — slowly exuding from Himalayan rock faces over thousands of years.",
                "Most shilajit on the market is adulterated, diluted or improperly purified. Ours is collected from high-altitude Ladakhi rock faces and purified using traditional methods.",
                "The result is resin that is genuinely potent — not a powder pressed into a capsule.",
              ],
              valleyImage: "/images/valleys/changthang.webp",
              badgeNumber: "∞",
              badgeText: "YEARS IN FORMATION",
              shloka: {
                devanagari: "शिलाजतु हिमालयः",
                translation: "The exudate of the Himalayan rock.",
                reference: "CHARAKA SAMHITA",
                wisdom:
                  "Shilajit was documented in ancient Ayurvedic texts as a rasayana — a substance that promotes longevity and restores what time takes away. The Himalayas have been producing it for longer than any civilization has existed.",
              },
            }
          : isSeabuckthorn
            ? {
                heading: "Why This Seabuckthorn Exists",
                eyebrow: "FROM NUBRA VALLEY",
                paragraphs: [
                  "Seabuckthorn grows wild in the cold desert valleys of Ladakh — one of the few plants that thrives where almost nothing else can.",
                  "The berries are harvested once a year, at peak ripeness, by hand. No chemicals. No irrigation. Pure cold-desert nutrition.",
                  "It is one of the most nutrient-dense fruits on earth. The Himalayas have known this for centuries.",
                ],
                valleyImage: "/images/valleys/nubra.webp",
                badgeNumber: "1",
                badgeText: "ANNUAL HARVEST",
                shloka: {
                  devanagari: "अमृतं हिमालयात्",
                  translation: "Nectar from the Himalayas.",
                  reference: "VEDIC TRADITION",
                  wisdom:
                    "The cold-desert ecology of Nubra Valley produces plants of extraordinary resilience. That resilience — the ability to thrive in extreme conditions — is what makes their fruit so nutritionally potent.",
                },
              }
            : {
                heading: `Why This ${product.name} Exists`,
                eyebrow: "FROM THE HIMALAYAS",
                paragraphs: [
                  product.story?.body ||
                    "Most products in the market are blended, processed, and filtered multiple times.",
                  `Our ${product.name} is raw, unprocessed, and sourced from a single Himalayan region.`,
                  "Pure, rare and true to its origin.",
                ],
                valleyImage: "/images/valleys/lahaul.webp",
                badgeNumber: "1",
                badgeText: "HIMALAYAN SOURCE",
                shloka: {
                  devanagari: product.shloka?.devanagari ?? "मधु वाता ऋतायते",
                  translation:
                    product.shloka?.translation ??
                    "May the winds bring sweetness.",
                  reference: "RIG VEDA",
                  wisdom:
                    "For the Vedic seers, sweetness was not merely a taste — it was a way of describing harmony between nature, seasons, rivers, forests, and life itself.",
                },
              };

  return (
    <section className="border-t border-border bg-background py-10 md:py-14">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="flex flex-col justify-center space-y-5">
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              {whyText.eyebrow}
            </p>
            <h2 className="font-display text-xl leading-tight tracking-[-0.02em] text-foreground md:text-2xl">
              {whyText.heading}
            </h2>
            <div className="space-y-3">
              <p className="text-sm leading-6 text-muted">
                {whyText.paragraphs[0]}
              </p>

              {expanded ? (
                <div className="animate-in fade-in space-y-3 duration-300">
                  {whyText.paragraphs.slice(1).map((para, i) => (
                    <p key={i} className="text-sm leading-6 text-muted">
                      {para}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-2 inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.15em] text-foreground transition-colors hover:text-gold"
            >
              {expanded ? "Show Less ↑" : "Know More →"}
            </button>
          </div>

          <div className="relative aspect-[3/2] overflow-hidden rounded-2xl md:aspect-auto md:min-h-[280px]">
            <Image
              src={whyText.valleyImage}
              alt="Himalayan valley"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
            <div className="absolute bottom-4 left-4 flex h-16 w-16 flex-col items-center justify-center rounded-full border border-border bg-background/90 p-2 text-center">
              <span className="font-display text-xl leading-none text-foreground">
                {whyText.badgeNumber}
              </span>
              <span className="mt-0.5 text-[0.45rem] leading-tight uppercase tracking-wide text-muted">
                {whyText.badgeText}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-gold/20 bg-[#f5f0e4] p-4 text-center">
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
