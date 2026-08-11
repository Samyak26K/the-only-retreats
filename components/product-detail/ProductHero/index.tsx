import Image, { getImageProps } from "next/image";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { getStartingPrice, type Product } from "@/lib/content/product";

type ProductHeroProps = {
  product: Product;
};

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductHero({ product }: ProductHeroProps) {
  const startingPrice = getStartingPrice(product);
  const imageMedia = product.media.filter((item) => item.type === "image");

  const sharedHeroImageProps = {
    alt: product.hero.media.alt,
    width: 1200,
    height: 1500,
    priority: true,
    sizes: "(min-width: 1024px) 55vw, 100vw",
    className: "h-full w-full object-cover",
  } as const;

  const {
    props: { srcSet: desktopSrcSet, sizes: desktopSizes },
  } = getImageProps({
    ...sharedHeroImageProps,
    src: product.hero.media.desktop,
  });

  const { props: mobileImageProps } = getImageProps({
    ...sharedHeroImageProps,
    src: product.hero.media.mobile,
  });

  return (
    <section aria-labelledby="product-title" className="bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) bg-forest md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <Container className="py-12 md:py-20 lg:py-24 xl:py-[7.5rem]">
        <div className="grid gap-14 md:gap-16 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:items-start lg:gap-16 xl:gap-24">
          <figure className="min-w-0">
            <div className="rounded-(--radius-panel) border border-border/80 bg-surface p-2 shadow-lg sm:p-3">
              <div className="aspect-[4/5] overflow-hidden rounded-xl bg-cloud md:aspect-[5/4] lg:aspect-[4/5] lg:min-h-[38rem] xl:min-h-[43rem]">
                <picture>
                  <source
                    media="(min-width: 768px)"
                    srcSet={desktopSrcSet}
                    sizes={desktopSizes}
                  />
                  <img {...mobileImageProps} alt={product.hero.media.alt} />
                </picture>
              </div>
            </div>

            <figcaption className="mt-5 md:mt-6">
              <span className="sr-only">Product media</span>
              <ul className="flex gap-3 overflow-hidden px-1 sm:gap-4">
                {imageMedia.map((item, index) => (
                  <li
                    key={item.id}
                    className="aspect-square w-16 shrink-0 overflow-hidden rounded-lg border border-gold/60 bg-surface p-1 shadow-sm sm:w-20"
                  >
                    <Image
                      src={item.src}
                      alt=""
                      width={80}
                      height={80}
                      loading="lazy"
                      className="h-full w-full rounded-md object-cover"
                    />
                    <span className="sr-only">
                      Product media preview {index + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>

          <article className="min-w-0 lg:py-6 xl:py-10">
            <header>
              <p className="inline-flex rounded-full border border-gold/60 bg-surface/60 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted shadow-sm">
                {product.origin}
              </p>

              <h1
                id="product-title"
                className="mt-6 max-w-2xl text-balance font-display text-[clamp(2.5rem,12vw,5.5rem)] leading-[0.9] tracking-[-0.045em] text-foreground md:mt-8 md:text-[clamp(3rem,5vw,5.5rem)]"
              >
                {product.name}
              </h1>

              <div className="mt-8 space-y-3 border-l border-gold pl-5 md:mt-10 md:space-y-4 md:pl-6">
                <p
                  lang="sa"
                  className="font-sanskrit text-xl leading-relaxed text-gold sm:text-2xl"
                >
                  {product.shloka.devanagari}
                </p>
                <p className="max-w-lg font-heading text-sm leading-6 text-muted italic sm:text-base sm:leading-7">
                  {product.shloka.translation}
                </p>
              </div>

              <p className="mt-8 max-w-xl font-body text-base leading-7 text-muted sm:text-lg sm:leading-8 md:mt-10">
                {product.tagline}
              </p>
            </header>

            <div className="mt-10 border-t border-border pt-8 md:mt-12 md:pt-10">
              {startingPrice !== undefined ? (
                <p className="font-heading text-2xl font-medium tracking-[-0.02em] text-foreground sm:text-3xl">
                  {formatPrice(startingPrice, product.currency)}
                </p>
              ) : null}

              <div className="mt-8 space-y-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Variant
                  </p>
                  <ul
                    aria-label="Available variants"
                    className="mt-3 flex flex-wrap gap-3"
                  >
                    {product.variants.map((variant) => (
                      <li
                        key={variant.id}
                        className="flex min-h-12 items-center rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground shadow-sm"
                      >
                        {variant.label}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Quantity
                  </p>
                  <output
                    aria-label="Quantity"
                    className="mt-3 flex h-12 w-24 items-center justify-center rounded-lg border border-border bg-surface text-sm font-medium text-foreground shadow-sm"
                  >
                    1
                  </output>
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    disabled
                    className="h-12 w-full px-6 uppercase tracking-[0.18em] sm:h-14"
                  >
                    Add to Ritual
                  </Button>
                </div>
              </div>
            </div>

            <aside
              aria-label="Product highlights"
              className="mt-10 border-t border-border pt-8 md:mt-12"
            >
              <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 xl:gap-5">
                {product.highlights.slice(0, 3).map((highlight) => (
                  <li
                    key={highlight.id}
                    className="border-l border-gold/60 pl-4"
                  >
                    <p className="font-heading text-sm font-medium leading-5 text-foreground">
                      {highlight.title}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      {highlight.description}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </article>
        </div>
      </Container>
    </section>
  );
}
