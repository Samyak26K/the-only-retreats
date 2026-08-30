import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DivyaProductHero } from "@/components/divya/DivyaProductHero";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDescription: true },
  });
  if (!product) return {};
  return {
    title: `${product.name} — Divya | The Only Retreats`,
    description: product.shortDescription ?? "",
  };
}

export default async function DivyaProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: { where: { status: "ACTIVE" } },
      media: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || product.brand !== "Divya") notFound();

  const related = await prisma.product.findMany({
    where: {
      brand: "Divya",
      slug: { not: slug },
    },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      media: { take: 1, select: { url: true } },
      variants: {
        where: { status: "ACTIVE" },
        take: 1,
        select: { sellingPrice: true },
      },
    },
  });

  const isComingSoon = product.status === "COMING_SOON";

  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    currency: product.currency,
    status: product.status,
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.name,
      sellingPrice: Number(v.sellingPrice),
      isDefault: v.isDefault,
      status: v.status,
    })),
    images: product.media.map((m) => ({
      url: m.url,
      alt: m.alt,
    })),
  };

  return (
    <div style={{ backgroundColor: "#FAF5EC" }} className="min-h-screen">
      {/* Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          backgroundColor: "#FAF5EC",
          borderBottom: "1px solid #B07428",
        }}
      >
        <Link
          href="/divya/products"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B07428" }}
        >
          ← Collection
        </Link>
        <Link
          href="/divya"
          className="absolute left-1/2 -translate-x-1/2 text-center font-display text-lg tracking-[0.3em] uppercase"
          style={{ color: "#2C1810" }}
        >
          Divya
        </Link>
        <Link
          href="/cart"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B07428" }}
        >
          Cart
        </Link>
      </nav>

      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.15em]"
            style={{ color: "#B07428" }}
          >
            <Link href="/divya" style={{ color: "#B07428" }}>
              Divya
            </Link>
            <span>/</span>
            <Link href="/divya/products" style={{ color: "#B07428" }}>
              Collection
            </Link>
            <span>/</span>
            <span style={{ color: "#2C1810" }}>{product.name}</span>
          </nav>

          {/* Coming soon state */}
          {isComingSoon ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              {/* Image */}
              <div
                className="aspect-square overflow-hidden rounded-2xl"
                style={{
                  backgroundColor: "#F0E8D8",
                  border: "1px solid #D4B896",
                }}
              >
                {productData.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={productData.images[0].url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p
                      className="font-display text-6xl opacity-10"
                      style={{ color: "#B07428" }}
                    >
                      ✦
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center space-y-6">
                <p
                  className="text-[0.6rem] uppercase tracking-[0.3em]"
                  style={{ color: "#B07428" }}
                >
                  Divya · Coming Soon
                </p>
                <h1
                  className="font-display text-3xl md:text-4xl"
                  style={{ color: "#2C1810" }}
                >
                  {product.name}
                </h1>
                {product.shortDescription ? (
                  <p className="text-sm leading-7" style={{ color: "#8A7560" }}>
                    {product.shortDescription}
                  </p>
                ) : null}
                <div
                  className="space-y-4 rounded-2xl p-6"
                  style={{
                    backgroundColor: "#F0E8D8",
                    border: "1px solid #D4B896",
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#2C1810" }}
                  >
                    This product is coming soon.
                  </p>
                  <p className="text-xs leading-5" style={{ color: "#8A7560" }}>
                    We are carefully curating this product to meet our quality
                    standards. Join our newsletter to be notified when it
                    launches.
                  </p>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs tracking-[0.2em] uppercase"
                    style={{
                      backgroundColor: "#6A2434",
                      color: "#FAF5EC",
                    }}
                  >
                    Notify Me
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <DivyaProductHero product={productData} />
          )}

          {/* Related products */}
          {related.length > 0 ? (
            <section
              className="mt-20 pt-12"
              style={{ borderTop: "1px solid #B07428" }}
            >
              <p
                className="mb-2 text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "#B07428" }}
              >
                You may also like
              </p>
              <h2
                className="font-display mb-8 text-2xl"
                style={{ color: "#2C1810" }}
              >
                More from Divya
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/divya/products/${r.slug}`}
                    className="group block"
                  >
                    <div
                      className="mb-3 aspect-square overflow-hidden rounded-xl"
                      style={{
                        backgroundColor: "#F0E8D8",
                        border: "1px solid #D4B896",
                      }}
                    >
                      {r.media[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.media[0].url}
                          alt={r.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <p
                            className="font-display text-3xl opacity-10"
                            style={{ color: "#B07428" }}
                          >
                            ✦
                          </p>
                        </div>
                      )}
                    </div>
                    <h3
                      className="font-display mb-1 text-sm leading-tight"
                      style={{ color: "#2C1810" }}
                    >
                      {r.name}
                    </h3>
                    {r.status === "COMING_SOON" ? (
                      <p className="text-xs" style={{ color: "#B07428" }}>
                        Coming Soon
                      </p>
                    ) : r.variants[0]?.sellingPrice ? (
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#6A2434" }}
                      >
                        ₹
                        {Number(r.variants[0].sellingPrice).toLocaleString(
                          "en-IN",
                        )}
                      </p>
                    ) : null}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
