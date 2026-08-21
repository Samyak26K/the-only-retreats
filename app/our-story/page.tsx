import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { FooterSection } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { founderContent } from "@/lib/content/founder";

export const metadata: Metadata = {
  title: "Our Story — The Only Retreats",
  description: "How The Only Retreats began, and why origin matters.",
};

export default function OurStoryPage() {
  return (
    <>
      <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />

      <section className="border-b border-border bg-background py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <p className="mb-4 text-[0.6rem] uppercase tracking-[0.24em] text-gold">
              Our Story
            </p>
            <h1 className="mb-6 font-display text-5xl leading-[0.95] tracking-[-0.03em] text-foreground md:text-7xl">
              The origin comes before the product.
            </h1>
            <p className="max-w-2xl font-body text-lg leading-8 text-muted">
              The Only Retreats was built on a single conviction — that the
              place a product comes from matters more than the product itself.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 md:py-20">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
            <div className="space-y-6">
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                The Philosophy
              </p>
              <h2 className="font-display text-3xl leading-tight tracking-[-0.03em] text-foreground md:text-4xl">
                Origin → Land → People → Animal → Tradition → Craft → Product →
                Experience
              </h2>
              <p className="font-body text-base leading-7 text-muted">
                Most brands take a product and add a story. We do the opposite.
                We start with the land — its altitude, its climate, its
                biodiversity — and follow the chain until a product emerges.
              </p>
              <p className="font-body text-base leading-7 text-muted">
                This is why we can tell you exactly which valley your honey came
                from, which family tended those bees, and what flowers bloomed
                at that altitude during that season.
              </p>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/valleys/lahaul.webp"
                alt="Lahaul Valley"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </Container>
      </section>

      <section
        className="border-t border-border py-16 md:py-20"
        style={{
          backgroundColor: "#1a2a1f",
          backgroundImage: "url('/topo.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "600px 600px",
        }}
      >
        <Container>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-[0.6rem] uppercase tracking-[0.24em] text-gold/70">
              Where We Source
            </p>
            <h2 className="font-display text-3xl tracking-[-0.03em] text-white/95 md:text-4xl">
              Five valleys. Five distinct worlds.
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/50">
              From Lahaul to Changthang, each valley we source from has its own
              altitude, ecology, and tradition.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              {
                name: "Lahaul",
                alt: "3,050m",
                img: "/images/valleys/lahaul.webp",
                slug: "lahaul",
              },
              {
                name: "Kullu",
                alt: "1,200m",
                img: "/images/valleys/kullu.webp",
                slug: "kullu",
              },
              {
                name: "Nubra",
                alt: "3,048m",
                img: "/images/valleys/nubra.webp",
                slug: "nubra",
              },
              {
                name: "Zanskar",
                alt: "3,500m",
                img: "/images/valleys/zanskar.webp",
                slug: "zanskar",
              },
              {
                name: "Changthang",
                alt: "4,350m",
                img: "/images/valleys/changthang.webp",
                slug: "changthang",
              },
            ].map((valley) => (
              <Link
                key={valley.slug}
                href={`/valleys/${valley.slug}`}
                className="group block"
              >
                <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={valley.img}
                    alt={valley.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 20vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-xs font-medium tracking-wide text-white uppercase">
                      {valley.name}
                    </p>
                    <p className="flex items-center gap-1 text-[0.6rem] text-white/60">
                      ▲ {valley.alt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-background py-16 md:py-20">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={founderContent.image}
                alt={founderContent.name}
                fill
                className="object-cover object-[center_20%]"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="space-y-6">
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                {founderContent.designation}
              </p>
              <blockquote className="font-display text-2xl leading-tight tracking-[-0.03em] text-foreground md:text-3xl">
                &ldquo;I did not set out to build a brand. I set out to
                understand something.&rdquo;
              </blockquote>
              <div className="h-px w-8 bg-gold" />
              <p className="font-body text-base leading-7 text-muted">
                {founderContent.story}
              </p>
              <p className="font-display text-lg text-foreground">
                {founderContent.name}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <FooterSection />
    </>
  );
}
