import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { founderContent } from "@/lib/content/founder";

export function FounderSection() {
  return (
    <section id="founder" className="bg-background pt-20 pb-12 md:py-28">
      <Container>
        <div className="grid items-stretch gap-0 lg:grid-cols-2 lg:gap-16 xl:gap-24">
          {/* Left: Image — full bleed on mobile */}
          <div className="relative aspect-[4/5] md:aspect-[3/4] max-h-[70svh] overflow-hidden rounded-2xl lg:aspect-auto lg:min-h-[500px]">
            <Image
              src={founderContent.image}
              alt={founderContent.name}
              fill
              className="object-cover object-[center_60%]"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            {/* Subtle gradient at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center space-y-8 pt-10 lg:pt-0">
            {/* Eyebrow */}
            <p className="text-xs uppercase tracking-[0.28em] text-muted">
              {founderContent.designation}
            </p>

            {/* Pull quote — the most powerful line */}
            <blockquote className="font-display text-2xl leading-[1.1] tracking-[-0.03em] text-foreground md:text-3xl lg:text-4xl">
              &ldquo;I did not set out to build a brand. I set out to understand
              something.&rdquo;
            </blockquote>

            {/* Divider */}
            <div className="h-px w-12 bg-gold" />

            {/* Story — shortened, most powerful paragraph */}
            <p className="max-w-lg font-body text-base leading-7 text-muted sm:text-lg sm:leading-8">
              I spent seasons living with herding families in Spiti, Lahaul and
              Zanskar. I saw how they tended land, animals and traditions with a
              patience that modern commerce has no room for. What I brought back
              was not a business plan. It was a responsibility.
            </p>

            <p className="max-w-lg font-body text-base leading-7 text-muted/70">
              The Only Retreats exists because some things should not be scaled.
              Some traditions deserve to be preserved, not disrupted. We are
              here to make that possible — one intentional product at a time.
            </p>

            {/* Signature */}
            <div className="pt-4">
              <p className="font-display text-xl tracking-[-0.02em] text-foreground">
                {founderContent.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                Founder & Custodian, The Only Retreats
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
