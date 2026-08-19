import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/prisma";

function statusLabel(status: string) {
  switch (status) {
    case "COMING_SOON":
      return "Coming Soon";
    case "SEASONAL":
      return "Seasonal";
    case "SOLD_OUT":
      return "Sold Out";
    default:
      return null;
  }
}

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value);
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      status: { in: ["ACTIVE", "COMING_SOON", "SEASONAL", "SOLD_OUT"] },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      primaryOrigin: {
        select: { name: true },
      },
      media: {
        orderBy: { sortOrder: "asc" },
        select: {
          url: true,
          alt: true,
        },
        take: 1,
      },
      variants: {
        where: { status: "ACTIVE" },
        select: {
          sellingPrice: true,
        },
      },
    },
  });

  return (
    <section className="bg-background">
      <div
        aria-hidden="true"
        className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)"
      />

      <Container>
        <header className="py-10 md:py-16">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            THE COLLECTION
          </p>
          <h1 className="mt-4 font-display text-5xl tracking-tight text-foreground md:text-7xl">
            From the Valleys
          </h1>
          <p className="mt-4 max-w-md font-body text-lg text-muted">
            Each product carries the story of its origin.
          </p>
        </header>

        {products.length === 0 ? (
          <p className="py-24 text-center text-muted">Products coming soon.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-8 pb-24 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {products.map((product) => {
              const prices = product.variants
                .map((variant) => toNumber(variant.sellingPrice))
                .filter((price) => Number.isFinite(price));
              const startingPrice =
                prices.length === 0 ? undefined : Math.min(...prices);
              const heroImage = product.media[0]?.url?.trim() ?? "";
              const badge = statusLabel(product.status);
              const priceLabel =
                startingPrice === undefined
                  ? null
                  : product.variants.length > 1
                    ? `From ₹${startingPrice.toLocaleString("en-IN")}`
                    : `₹${startingPrice.toLocaleString("en-IN")}`;

              return (
                <li key={product.id}>
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-surface">
                      {heroImage ? (
                        <Image
                          src={heroImage}
                          alt={product.media[0]?.alt || product.name}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-surface">
                          <p className="text-xs uppercase tracking-[0.15em] text-muted">
                            {product.name}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-muted">
                        {product.primaryOrigin?.name ?? ""}
                      </p>
                      <h2 className="mt-1 font-heading text-xl text-foreground">
                        {product.name}
                      </h2>
                      {priceLabel ? (
                        <p className="mt-2 font-heading text-base text-gold">
                          {priceLabel}
                        </p>
                      ) : null}
                      {badge ? (
                        <p className="mt-2 inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted">
                          {badge}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </section>
  );
}
