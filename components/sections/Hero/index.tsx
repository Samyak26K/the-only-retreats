import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { heroContent } from "@/lib/content/hero";

export function HeroSection() {
  return (
    <Section>
      <Container className="flex flex-col items-center justify-center">
        <div className="space-y-8 sm:space-y-10">
          <Heading
            eyebrow={heroContent.shloka}
            title={heroContent.title}
            subtitle={heroContent.subtitle}
            alignment="center"
            className="mx-auto"
          />

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
            <Link
              href={heroContent.primaryCTA.href}
              className="inline-flex h-9 gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {heroContent.primaryCTA.label}
            </Link>
            <Link
              href={heroContent.secondaryCTA.href}
              className="inline-flex h-9 gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {heroContent.secondaryCTA.label}
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
