import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductHero } from "@/components/product-detail/ProductHero";
import { ProductInfoGrid } from "@/components/product-detail/ProductInfoGrid";
import { ProductJourney } from "@/components/product-detail/ProductJourney";
import { ProductRelatedProducts } from "@/components/product-detail/ProductRelatedProducts";
import { ProductWhyExists } from "@/components/product-detail/ProductWhyExists";
import { FooterSection } from "@/components/sections/Footer";
import { getProductBySlug } from "@/lib/content/product";
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product =
    (await getPublishedProductBySlug(slug)) ?? getProductBySlug(slug) ?? null;

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductHero product={product} />
      <ProductWhyExists product={product} />
      <ProductJourney steps={product.originJourney} />
      <ProductInfoGrid product={product} />
      <ProductRelatedProducts product={product} />
      <FooterSection />
    </>
  );
}
