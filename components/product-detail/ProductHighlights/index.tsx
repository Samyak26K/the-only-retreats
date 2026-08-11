import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/lib/content/product";

type ProductHighlightsProps = {
  highlights: Product["highlights"];
};

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (highlights.length === 0) {
    return null;
  }

  return (
    <Section
      aria-labelledby="product-highlights-title"
      background="surface"
      className="py-12 md:py-16 xl:py-20"
    >
      <Container>
        <h2 id="product-highlights-title" className="sr-only">
          Product highlights
        </h2>

        <Divider />
        <ul className="grid md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <li
              key={highlight.id}
              className="group border-b border-border px-1 py-8 transition-colors duration-normal last:border-b-0 hover:bg-background/60 md:border-r md:border-b-0 md:px-8 md:first:pl-1 md:last:border-r-0 md:last:pr-1"
            >
              <article>
                <p className="text-xs font-medium tracking-[0.2em] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-heading text-xl leading-tight text-foreground">
                  {highlight.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-muted">
                  {highlight.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
        <Divider />
      </Container>
    </Section>
  );
}
