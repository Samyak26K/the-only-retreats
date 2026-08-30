import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";
import { PriceDisplay } from "./PriceDisplay";

export async function CollectionSection() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { brand: "Himalayan" },
        { brand: "The Only Retreats" },
        { brand: null },
        { brand: "" },
      ],
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      media: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
      variants: {
        where: { status: "ACTIVE" },
        orderBy: { sellingPrice: "asc" },
        take: 1,
        select: { sellingPrice: true },
      },
      passport: {
        select: { region: true, altitude: true },
      },
    },
  });

  if (products.length === 0) return null;

  const productShlokas: Record<
    string,
    { sanskrit: string; translation: string }
  > = {
    "himalayan-wild-forest-honey": {
      sanskrit: "मधु वाता ऋतायते",
      translation: "May the winds bring sweetness",
    },
    "himalayan-thyme-honey": {
      sanskrit: "मधु नक्तमुतोषसि",
      translation: "Sweet be the night and sweet the dawn",
    },
    "himalayan-winter-white-honey": {
      sanskrit: "मधु वाता ऋतायते",
      translation: "May the winds bring sweetness",
    },
    "himalayan-chestnut-honey": {
      sanskrit: "मधु नक्तमुतोषसि",
      translation: "Sweet be the night and sweet the dawn",
    },
    "himalayan-honeydew-honey": {
      sanskrit: "मधु वाता ऋतायते",
      translation: "May the winds bring sweetness",
    },
    "himalayan-vedic-ghee": {
      sanskrit: "गावो विश्वस्य मातरः",
      translation: "The cow is the mother of the world",
    },
    "himalayan-vedic-yak-ghee": {
      sanskrit: "गावो विश्वस्य मातरः",
      translation: "The cow is the mother of the world",
    },
    "himalayan-ladakhi-shilajit": {
      sanskrit: "शिलाजतु हिमालयः",
      translation: "The exudate of the Himalayas",
    },
    "himalayan-coffee": {
      sanskrit: "प्रकृतिः सर्वस्य",
      translation: "Nature is everything",
    },
    "himalayan-sea-buckthorn-pulp": {
      sanskrit: "अमृतं हिमालयात्",
      translation: "Nectar from the Himalayas",
    },
  };

  return (
    <section id="collection" className="py-12 md:py-20 bg-background">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted mb-2">
              FEATURED COLLECTION
            </p>
            <h2 className="font-display text-4xl md:text-5xl tracking-[-0.03em] text-foreground leading-[0.95]">
              विशिष्ट संग्रह
            </h2>
            <p className="font-display text-base text-muted italic mt-2">
              Nourishment crafted by nature, honoured by tradition.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden md:block text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors border-b border-border pb-0.5"
          >
            View All
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((product, index) => {
            const shloka = productShlokas[product.slug];
            const image = product.media[0]?.url;
            const price = product.variants[0]?.sellingPrice;
            const origin = product.passport?.region;
            const altitude = product.passport?.altitude;

            return (
              <div
                key={product.id}
                className="flex-none w-[80vw] md:w-[380px] snap-start"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface mb-5">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image}
                        alt={product.media[0]?.alt ?? product.name}
                        className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundColor: "#f5f0e8" }}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface flex items-center justify-center">
                        <p className="text-xs text-muted uppercase tracking-widest">
                          {product.name}
                        </p>
                      </div>
                    )}

                    {/* Number overlay */}
                    <div className="absolute top-4 left-4">
                      <span className="font-display text-5xl text-white/10 leading-none select-none">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Altitude badge */}
                    {altitude && (
                      <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                        <p className="text-xs text-white/80 tracking-wider">
                          ▲ {altitude}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 px-1">
                    {shloka && (
                      <div className="border-l-2 border-gold/40 pl-3">
                        <p
                          lang="sa"
                          className="font-sanskrit text-sm text-gold leading-relaxed"
                        >
                          {shloka.sanskrit}
                        </p>
                        <p className="text-xs text-muted italic mt-0.5">
                          {shloka.translation}
                        </p>
                      </div>
                    )}

                    {origin && (
                      <p className="text-[0.6rem] uppercase tracking-[0.2em] text-muted">
                        {origin}
                      </p>
                    )}

                    <h3 className="font-display text-xl text-foreground tracking-[-0.02em] group-hover:text-forest transition-colors">
                      {product.name}
                    </h3>

                    {price && (
                      <div className="flex items-center justify-between pt-1">
                        <PriceDisplay priceINR={Number(price)} />
                        <span className="text-xs uppercase tracking-[0.15em] text-muted group-hover:text-forest transition-colors">
                          Discover →
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View all */}
        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors border-b border-border hover:border-foreground pb-1"
          >
            View Full Collection
          </Link>
        </div>
      </Container>
    </section>
  );
}
