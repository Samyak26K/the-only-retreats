import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getFeaturedProduct } from "@/lib/content/collection";

export function CollectionSection() {
  const featuredProduct = getFeaturedProduct();

  if (!featuredProduct) {
    return null;
  }

  return (
    <Section id="collection" background="surface">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Left: Large product image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-surface lg:aspect-square">
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
              <span className="text-sm text-muted">Product Image</span>
            </div>
          </div>

          {/* Right: Editorial content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Eyebrow label */}
            {featuredProduct.tagline && (
              <p className="font-sanskrit text-[0.75rem] uppercase tracking-[0.28em] text-muted sm:text-sm">
                {featuredProduct.tagline}
              </p>
            )}

            {/* Product title */}
            <h2 className="font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-[0.95] tracking-[-0.04em] text-foreground">
              {featuredProduct.name}
            </h2>

            {/* Origin */}
            <p className="text-[0.75rem] uppercase tracking-[0.24em] text-muted">
              {featuredProduct.origin}
            </p>

            {/* Editorial description */}
            <p className="font-body text-base leading-7 text-muted/90 sm:text-lg sm:leading-8">
              {featuredProduct.editorialDescription}
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col gap-4">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Discover Yak Ghee
              </Link>

              {/* Secondary link */}
              <Link
                href="#"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                View Full Collection
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
