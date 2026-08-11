import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductCertifications } from "@/components/product-detail/ProductCertifications";
import { ProductFAQ } from "@/components/product-detail/ProductFAQ";
import { ProductHero } from "@/components/product-detail/ProductHero";
import { ProductHighlights } from "@/components/product-detail/ProductHighlights";
import { ProductJourney } from "@/components/product-detail/ProductJourney";
import { ProductNutrition } from "@/components/product-detail/ProductNutrition";
import { ProductPassport } from "@/components/product-detail/ProductPassport";
import { ProductRelatedProducts } from "@/components/product-detail/ProductRelatedProducts";
import { ProductReviews } from "@/components/product-detail/ProductReviews";
import { ProductRitualGuide } from "@/components/product-detail/ProductRitualGuide";
import { ProductShloka } from "@/components/product-detail/ProductShloka";
import { ProductStory } from "@/components/product-detail/ProductStory";
import { ProductTasteProfile } from "@/components/product-detail/ProductTasteProfile";
import { FooterSection } from "@/components/sections/Footer";
import { getAllProductSlugs, getProductBySlug } from "@/lib/content/product";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductHero product={product} />
      <ProductHighlights highlights={product.highlights} />
      <ProductStory story={product.story} />
      <ProductShloka shloka={product.shloka} />
      <ProductJourney steps={product.originJourney} />
      <ProductPassport passport={product.productPassport} />
      <ProductTasteProfile tasteProfile={product.tasteProfile} />
      <ProductNutrition nutrition={product.nutrition} />
      <ProductCertifications certifications={product.certifications} />
      <ProductRitualGuide ritualGuide={product.ritualGuide} />
      <ProductFAQ faqs={product.faqs} />
      <ProductReviews reviews={product.reviews} />
      <ProductRelatedProducts product={product} />
      <FooterSection />
    </>
  );
}
