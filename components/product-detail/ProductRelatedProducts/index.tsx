import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import {
  getRelatedProducts,
  getStartingPrice,
  type Product,
} from "@/lib/content/product";

type ProductRelatedProductsProps = {
  product: Product;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductRelatedProducts({
  product,
}: ProductRelatedProductsProps) {
  const relatedProducts = getRelatedProducts(product).slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <Section aria-labelledby="product-related-title">
      <Container>
        <Heading
          eyebrow="Continue Exploring"
          title={<span id="product-related-title">Related products</span>}
          className="mb-12 max-w-3xl md:mb-16"
        />

        <ul className="-mx-6 flex gap-6 overflow-x-auto px-6 pb-2 snap-x snap-mandatory md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 xl:grid-cols-4">
          {relatedProducts.map((related) => {
            const startingPrice = getStartingPrice(related);

            return (
              <li
                key={related.id}
                className="w-[78%] shrink-0 snap-start motion-safe:animate-[hero-rise_600ms_ease-out_both] motion-safe:[animation-range:entry_10%_cover_30%] motion-safe:[animation-timeline:view()] sm:w-[58%] md:w-auto"
              >
                <article className="flex h-full flex-col">
                  <div
                    aria-hidden="true"
                    className="aspect-[4/5] rounded-(--radius-panel) border border-border bg-cloud"
                  />

                  <div className="mt-6 flex flex-1 flex-col">
                    <h3 className="font-display text-2xl leading-tight tracking-[-0.03em] text-foreground">
                      {related.name}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                      {related.origin}
                    </p>
                    {startingPrice !== undefined ? (
                      <p className="mt-4 font-heading text-lg text-foreground">
                        {formatPrice(startingPrice, related.currency)}
                      </p>
                    ) : null}

                    <div className="mt-6">
                      <Button
                        render={<Link href={`/products/${related.slug}`} />}
                        className="h-10 px-4 uppercase tracking-[0.16em]"
                      >
                        View Product
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
