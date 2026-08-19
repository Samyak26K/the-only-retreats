import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import type { Product } from "@/lib/content/product";
import { prisma } from "@/lib/prisma";

type Props = {
  product: Product;
};

export async function ProductRelatedProducts({ product }: Props) {
  const otherProducts = await prisma.product.findMany({
    where: {
      status: { in: ["ACTIVE", "SEASONAL"] },
      slug: { not: product.slug },
    },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      primaryOrigin: { select: { name: true } },
      media: {
        orderBy: { sortOrder: "asc" },
        take: 1,
        select: { url: true, alt: true },
      },
      variants: {
        where: { status: "ACTIVE" },
        select: { sellingPrice: true },
        take: 1,
      },
    },
  });

  const staticFallbacks = [
    {
      id: "static-1",
      name: "Himalayan Badri Cow Ghee",
      slug: "himalayan-badri-cow-ghee",
      origin: "Kullu Valley, Himachal Pradesh",
      image: "/images/valleys/kullu.webp",
      price: "₹1,050",
    },
    {
      id: "static-2",
      name: "Wild Thyme Honey",
      slug: "wild-thyme-honey",
      origin: "Lahaul Valley, Himachal Pradesh",
      image: "/images/valleys/lahaul.webp",
      price: "Coming Soon",
    },
    {
      id: "static-3",
      name: "Seabuckthorn",
      slug: "seabuckthorn",
      origin: "Nubra Valley, Ladakh",
      image: "/images/valleys/nubra.webp",
      price: "Coming Soon",
    },
  ].filter((item) => item.slug !== product.slug);

  const dbProducts = otherProducts.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    origin: item.primaryOrigin?.name ?? "",
    image: item.media[0]?.url ?? "",
    price: item.variants[0]?.sellingPrice
      ? `₹${Number(item.variants[0].sellingPrice).toLocaleString("en-IN")}`
      : null,
  }));

  const products = dbProducts.length > 0 ? dbProducts : staticFallbacks;

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-background py-14 md:py-20">
      <Container>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[0.6rem] uppercase tracking-[0.2em] text-muted">
              EXPLORE OTHER RITUALS
            </p>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-foreground md:text-3xl">
              You may also like
            </h2>
          </div>
          <Link
            href="/products"
            className="border-b border-border pb-0.5 text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
          >
            View All
          </Link>
        </div>

        <div
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="group block w-[70vw] flex-none snap-start sm:w-[45vw] md:w-auto"
            >
              <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-surface">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 25vw, 70vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-surface">
                    <span className="text-xs text-muted">{item.name}</span>
                  </div>
                )}
              </div>

              <p className="mb-1 text-[0.6rem] uppercase tracking-wide text-muted">
                {item.origin}
              </p>
              <p className="font-heading text-sm font-medium text-foreground transition-colors group-hover:text-forest">
                {item.name}
              </p>
              {item.price ? (
                <p className="mt-1 text-xs text-gold">{item.price}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
