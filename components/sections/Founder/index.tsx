import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { founderContent } from "@/lib/content/founder";

export function FounderSection() {
  return (
    <Section id="founder">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left: Portrait placeholder */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-surface lg:aspect-[3/4]">
            <Image
              src={founderContent.image}
              alt={founderContent.name}
              fill
              className="object-cover object-top"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          {/* Right: Editorial content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Eyebrow label */}
            <p className="font-sanskrit text-[0.75rem] uppercase tracking-[0.28em] text-muted sm:text-sm">
              {founderContent.designation}
            </p>

            {/* Editorial heading */}
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
              The Founder
            </h2>

            {/* Story copy */}
            <p className="font-body text-base leading-7 text-muted/90 sm:text-lg sm:leading-8">
              {founderContent.story}
            </p>

            {/* Founder name */}
            <p className="font-display text-lg tracking-[-0.02em] text-foreground">
              {founderContent.name}
            </p>

            {/* Primary CTA */}
            <Link
              href="#origins"
              className="inline-flex h-10 w-fit items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Explore Origins
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
