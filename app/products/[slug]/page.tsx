import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductCompliance } from "@/components/product-detail/ProductCompliance";
import { ProductComplianceHoney } from "@/components/product-detail/ProductComplianceHoney";
import { ProductHero } from "@/components/product-detail/ProductHero";
import { ProductInfoGrid } from "@/components/product-detail/ProductInfoGrid";
import { ProductJourney } from "@/components/product-detail/ProductJourney";
import { ProductRelatedProducts } from "@/components/product-detail/ProductRelatedProducts";
import { ProductWhyExists } from "@/components/product-detail/ProductWhyExists";
import { FooterSection } from "@/components/sections/Footer";
import { getProductBySlug } from "@/lib/content/product";
import { prisma } from "@/lib/prisma";
import { getPublishedProductBySlug } from "@/lib/storefront/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product =
    (await getPublishedProductBySlug(slug)) ?? getProductBySlug(slug) ?? null;

  if (!product) {
    return {};
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      url: `/products/${product.slug}`,
      images: product.seo.ogImage ? [{ url: product.seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo.title,
      description: product.seo.description,
      images: product.seo.ogImage ? [product.seo.ogImage] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { status: { in: ["ACTIVE", "SEASONAL"] } },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export const revalidate = 3600;

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product =
    (await getPublishedProductBySlug(slug)) ?? getProductBySlug(slug) ?? null;

  if (!product) {
    notFound();
  }

  const showJourney =
    product.slug.includes("honey") ||
    product.slug.includes("ghee") ||
    product.name.toLowerCase().includes("honey") ||
    product.name.toLowerCase().includes("ghee");

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background animate-pulse">
          <div className="h-(--navbar-height-mobile) md:h-(--navbar-height-tablet) lg:h-(--navbar-height-desktop)" />
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square rounded-2xl bg-surface" />
              <div className="space-y-4">
                <div className="h-4 bg-surface rounded w-1/3" />
                <div className="h-8 bg-surface rounded w-2/3" />
                <div className="h-4 bg-surface rounded w-1/2" />
                <div className="h-12 bg-surface rounded w-full mt-8" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <>
        <ProductHero product={product} />
        <ProductWhyExists product={product} />
        {showJourney && <ProductJourney steps={product.originJourney} />}
        <ProductInfoGrid product={product} />
        <ProductCompliance product={product} />
        <ProductComplianceHoney product={product} />
        <ProductRelatedProducts product={product} />
        <FooterSection />
      </>
    </Suspense>
  );
}
