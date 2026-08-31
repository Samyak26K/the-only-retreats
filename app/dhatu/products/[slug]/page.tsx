import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DhatuProductHero } from "@/components/dhatu/DhatuProductHero";
import { DhatuProductSections } from "@/components/dhatu/DhatuProductSections";
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
    title: `${product.name} — Tridhatu Kosh | The Only Retreats`,
    description: product.shortDescription ?? "",
  };
}

export default async function DhatuProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        where: { status: "ACTIVE" },
        orderBy: { netQuantity: "asc" },
      },
      media: {
        orderBy: { sortOrder: "asc" },
      },
      passport: true,
    },
  });

  if (!product || product.brand !== "Dhatu") notFound();

  const related = await prisma.product.findMany({
    where: {
      brand: "Dhatu",
      status: "ACTIVE",
      slug: { not: slug },
    },
    take: 4,
    select: {
      id: true,
      name: true,
      slug: true,
      media: { take: 1, select: { url: true } },
      variants: {
        where: { status: "ACTIVE" },
        take: 1,
        select: { sellingPrice: true },
      },
    },
  });

  const productData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    currency: product.currency,
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
    altitude: product.passport?.altitude ?? null,
    region: product.passport?.region ?? null,
  };

  return (
    <div style={{ backgroundColor: "#1A1210" }} className="min-h-screen">
      {/* Navbar */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          backgroundColor: "#1A1210",
          borderBottom: "1px solid #5A3A2A",
        }}
      >
        <Link
          href="/dhatu/products"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B8A98F" }}
        >
          ← Collection
        </Link>
        <Link
          href="/dhatu"
          className="absolute left-1/2 -translate-x-1/2 text-center font-display text-lg tracking-[0.3em] uppercase"
          style={{ color: "#F2EBE0" }}
        >
          Tridhatu Kosh
        </Link>
        <Link
          href="/cart"
          className="text-[0.6rem] uppercase tracking-[0.2em]"
          style={{ color: "#B8A98F" }}
        >
          Cart
        </Link>
      </nav>

      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
          {/* Breadcrumb */}
          <nav
            className="mb-8 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.15em]"
            style={{ color: "#5A3A2A" }}
          >
            <Link href="/dhatu" style={{ color: "#5A3A2A" }}>
              Tridhatu Kosh
            </Link>
            <span>/</span>
            <Link href="/dhatu/products" style={{ color: "#5A3A2A" }}>
              Collection
            </Link>
            <span>/</span>
            <span style={{ color: "#B8A98F" }}>{product.name}</span>
          </nav>

          {/* Product hero */}
          <DhatuProductHero product={productData} />

          <DhatuProductSections
            productName={product.name}
            category={
              product.brand === "Dhatu"
                ? product.name.toLowerCase().includes("copper")
                  ? "Copper"
                  : product.name.toLowerCase().includes("brass")
                    ? "Brass"
                    : product.name.toLowerCase().includes("kansa")
                      ? "Kansa"
                      : "Dhatu"
                : "Dhatu"
            }
          />

          {/* Related products */}
          {related.length > 0 ? (
            <section
              className="mt-20 pt-12"
              style={{ borderTop: "1px solid #5A3A2A" }}
            >
              <p
                className="mb-2 text-[0.6rem] uppercase tracking-[0.3em]"
                style={{ color: "#B25B32" }}
              >
                You may also like
              </p>
              <h2
                className="font-display mb-8 text-2xl"
                style={{ color: "#F2EBE0" }}
              >
                More from Tridhatu Kosh
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/dhatu/products/${r.slug}`}
                    className="group block"
                  >
                    <div
                      className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl"
                      style={{
                        backgroundColor: "#241812",
                        border: "1px solid #5A3A2A",
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
                        <p
                          className="font-display text-3xl opacity-10"
                          style={{ color: "#B25B32" }}
                        >
                          ✦
                        </p>
                      )}
                    </div>
                    <h3
                      className="font-display mb-1 text-sm leading-tight transition-opacity group-hover:opacity-70"
                      style={{ color: "#F2EBE0" }}
                    >
                      {r.name}
                    </h3>
                    {r.variants[0]?.sellingPrice ? (
                      <p className="text-xs" style={{ color: "#C89B4A" }}>
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
