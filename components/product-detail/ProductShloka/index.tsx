import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";

type ProductShlokaProps = {
  shloka: Product["shloka"];
};

export function ProductShloka({ shloka }: ProductShlokaProps) {
  return (
    <Section
      aria-labelledby="product-shloka-title"
      background="surface"
      className="py-20 md:py-28 xl:py-36"
    >
      <Container>
        <figure className="mx-auto max-w-4xl text-center">
          <blockquote>
            <p
              id="product-shloka-title"
              lang="sa"
              className="font-sanskrit text-[clamp(2rem,5vw,4.5rem)] leading-relaxed text-gold"
            >
              {shloka.devanagari}
            </p>
            <p className="sr-only">{shloka.transliteration}</p>
            <p className="mx-auto mt-6 max-w-2xl font-display text-2xl leading-snug text-foreground italic md:mt-8 md:text-3xl">
              {shloka.translation}
            </p>
          </blockquote>

          {shloka.context ? (
            <figcaption className="mt-10 md:mt-12">
              <Divider variant="center" className="border-gold" />
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                The Only Retreats Reflection
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base md:leading-8">
                {shloka.context}
              </p>
            </figcaption>
          ) : null}
        </figure>
      </Container>
    </Section>
  );
}
