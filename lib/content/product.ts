/**
 * Single source of truth for Product Detail Page (PDP) content.
 *
 * Every PDP section (Hero, Highlights, Story, Shloka, OriginJourney,
 * ProductPassport, TasteProfile, Nutrition, Certifications, RitualGuide, FAQ,
 * LabHighlights, Reviews, RelatedProducts) reads from the `Product` shape below.
 * Components must never hardcode product copy, imagery, or pricing —
 * everything flows through this module.
 *
 * This is intentionally decoupled from the lightweight `Product` type in
 * `lib/content/collection.ts`, which powers the existing homepage
 * "Featured Collection" section and is out of scope for this pass.
 */

export type ProductCategory =
  "ghee" | "honey" | "butter" | "spice-blend" | "tea" | "other";

export type ProductStatus = "active" | "comingSoon" | "seasonal" | "soldOut";

export type InventoryStatus = "inStock" | "lowStock" | "outOfStock";

export interface ProductBadge {
  label: string;
  /** Design intent only; the UI owns the visual token mapping. */
  tone: "gold" | "green" | "stone";
}

export interface ProductHeroMedia {
  desktop: string;
  mobile: string;
  alt: string;
}

interface ProductMediaBase {
  id: string;
  alt: string;
  variant?: "packaging" | "lifestyle" | "texture" | "origin";
}

export interface ProductImageMedia extends ProductMediaBase {
  type: "image";
  src: string;
}

export interface ProductVideoMedia extends ProductMediaBase {
  type: "video";
  src: string;
  poster?: string;
}

export type ProductMedia = ProductImageMedia | ProductVideoMedia;

export interface ProductVariant {
  id: string;
  /** Display label, e.g. "250g", "60 capsules", or "Gift box". */
  label: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inStock: boolean;
  isDefault?: boolean;
}

export interface ProductHighlight {
  id: string;
  /** Lucide icon name (e.g. "Leaf") or a static asset path. */
  icon: string;
  title: string;
  description: string;
}

export interface ProductStory {
  eyebrow?: string;
  title: string;
  body: string;
  image: string;
}

export interface ProductShloka {
  devanagari: string;
  transliteration: string;
  translation: string;
  context?: string;
}

export interface ProductJourneyStep {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string;
}

export interface ProductPassport {
  /** References a Valley id from `lib/content/origins.ts` where possible. */
  originId: string;
  region: string;
  altitude?: string;
  harvestSeason?: string;
  community?: string;
  traceabilityCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ProductTasteAttribute {
  label: string;
  /** 1 (subtle) to 5 (intense). */
  intensity: number;
}

export interface ProductTasteProfile {
  summary: string;
  attributes: ProductTasteAttribute[];
  pairings?: string[];
}

export interface ProductNutritionFact {
  label: string;
  value: string;
}

export interface ProductNutrition {
  servingSize: string;
  facts: ProductNutritionFact[];
  allergens?: string[];
  disclaimer?: string;
}

export interface ProductCertification {
  id: string;
  title: string;
  description: string;
  /** String identifier resolved by the UI. */
  icon: string;
}

export interface ProductRitualStep {
  id: string;
  step: number;
  title: string;
  description: string;
  image?: string;
}

export interface ProductRitualGuide {
  title: string;
  intro?: string;
  steps: ProductRitualStep[];
  tips?: string[];
}

export interface ProductFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ProductLabHighlight {
  id: string;
  title: string;
  description: string;
  metric?: string;
  source?: string;
}

export interface ProductReview {
  id: string;
  name: string;
  location: string;
  review: string;
  /** 1 to 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  verifiedPurchase: boolean;
  /** ISO 8601 date string. */
  createdAt: string;
}

export interface ProductReviewMetrics {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}

export interface ProductSEO {
  title: string;
  description: string;
  ogImage?: string;
}

export interface ProductHero {
  media: ProductHeroMedia;
  scrollCue?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  currency: string;
  origin: string;
  status: ProductStatus;
  inventoryStatus: InventoryStatus;
  featured: boolean;
  badge?: ProductBadge;

  hero: ProductHero;
  media: ProductMedia[];
  variants: ProductVariant[];
  highlights: ProductHighlight[];
  story: ProductStory;
  shloka: ProductShloka;
  originJourney: ProductJourneyStep[];
  productPassport: ProductPassport;
  tasteProfile: ProductTasteProfile;
  nutrition: ProductNutrition;
  certifications: ProductCertification[];
  ritualGuide: ProductRitualGuide;
  faqs: ProductFAQ[];
  labHighlights: ProductLabHighlight[];
  reviews: ProductReview[];
  /** Slugs of other products in `products`, resolved via `getRelatedProducts`. */
  relatedProductSlugs: string[];
  seo: ProductSEO;
}

/**
 * Launch catalog. Populated with a single fully-typed sample so the PDP
 * route, data contract, and 404 behavior can be verified end-to-end before
 * the remaining 8 launch products receive real content.
 */
export const products: Product[] = [
  {
    id: "winter-white-honey",
    slug: "winter-white-honey",
    name: "Winter White Honey",
    tagline:
      "Raw, unheated, unfiltered. Harvested from a single Himalayan flowering season.",
    category: "honey",
    currency: "INR",
    origin: "Lahaul Valley, Himachal Pradesh",
    status: "active",
    inventoryStatus: "inStock",
    featured: true,
    badge: {
      label: "High Altitude",
      tone: "gold",
    },

    hero: {
      media: {
        desktop: "/images/products/winter-white-honey.jpeg",
        mobile: "/images/products/winter-white-honey.jpeg",
        alt: "Jar of Winter White Honey with Himalayan mountains in background",
      },
      scrollCue: "Discover the Craft",
    },

    media: [
      {
        id: "packaging",
        type: "image",
        src: "/images/products/winter-white-honey.jpeg",
        alt: "Winter White Honey jar packaging",
        variant: "packaging",
      },
    ],

    variants: [
      {
        id: "250g",
        label: "250g",
        price: 1200,
        sku: "TOR-YGP-250",
        inStock: true,
        isDefault: true,
      },
      {
        id: "500g",
        label: "500g",
        price: 2200,
        compareAtPrice: 2400,
        sku: "TOR-YGP-500",
        inStock: true,
      },
    ],

    highlights: [
      {
        id: "high-altitude",
        icon: "Mountain",
        title: "High Altitude Sourced",
        description: "Herded at 12,000 feet in the cold desert of Spiti.",
      },
      {
        id: "wood-fire",
        icon: "Flame",
        title: "Wood Fire Clarified",
        description: "Slow-clarified in small batches, the traditional way.",
      },
      {
        id: "no-additives",
        icon: "Leaf",
        title: "Nothing Added",
        description: "Pure yak milk fat. No preservatives, no shortcuts.",
      },
    ],

    story: {
      eyebrow: "The Story",
      title: "A Jar Shaped by Patience",
      body: "This ghee carries the essence of Spiti — cold mountain air, sparse grasslands, and centuries of herding wisdom. Each jar is a testament to patience, purity, and the relationship between land, animal, and caretaker.",
      image: "/images/heritage-pastoral.jpg",
    },

    shloka: {
      devanagari: "अन्नं ब्रह्म इति व्यजानात्",
      transliteration: "Annaṃ brahma iti vyajānāt",
      translation: "One should know food as the divine itself.",
      context: "Taittirīya Upaniṣad, on the sanctity of nourishment.",
    },

    originJourney: [
      {
        id: "herd",
        title: "The Herd",
        description:
          "Yaks graze freely across sparse, high-altitude grasslands.",
        image: "/images/valley-spiti.jpg",
        location: "Spiti Valley",
      },
      {
        id: "churn",
        title: "The Churn",
        description:
          "Milk is hand-churned by herding families using traditional methods.",
        image: "/images/heritage-pastoral.jpg",
        location: "Spiti Valley",
      },
      {
        id: "clarify",
        title: "The Clarify",
        description:
          "Butter is slow-clarified over wood fire until golden and pure.",
        image: "/images/product-yak-ghee.jpg",
        location: "Spiti Valley",
      },
    ],

    productPassport: {
      originId: "spiti",
      region: "Himachal Pradesh, India",
      altitude: "12,000 ft",
      harvestSeason: "Summer grazing season",
      community: "Spitian herding families",
      traceabilityCode: "TOR-SPT-YGP",
    },

    tasteProfile: {
      summary: "Rich, grassy, and deeply aromatic with a golden, nutty finish.",
      attributes: [
        { label: "Richness", intensity: 5 },
        { label: "Nuttiness", intensity: 4 },
        { label: "Grassiness", intensity: 3 },
        { label: "Sweetness", intensity: 2 },
      ],
      pairings: ["Warm rice", "Traditional flatbreads", "Herbal tea"],
    },

    nutrition: {
      servingSize: "1 tbsp (14g)",
      facts: [
        { label: "Energy", value: "126 kcal" },
        { label: "Total Fat", value: "14g" },
        { label: "Saturated Fat", value: "9g" },
        { label: "Protein", value: "0g" },
        { label: "Carbohydrates", value: "0g" },
      ],
      allergens: ["Milk"],
      disclaimer: "Values are approximate and may vary by batch.",
    },

    certifications: [
      {
        id: "organic-certified",
        title: "Organic Certified",
        description: "Certified to recognized organic production standards.",
        icon: "leaf",
      },
      {
        id: "traceable-source",
        title: "Traceable Source",
        description: "Traceable to its source community in Spiti Valley.",
        icon: "map-pin",
      },
    ],

    ritualGuide: {
      title: "How to Use Your Ghee",
      intro: "A little goes a long way. Here is how we enjoy it at home.",
      steps: [
        {
          id: "warm",
          step: 1,
          title: "Warm Gently",
          description:
            "Scoop a spoonful and let it melt naturally into warm food.",
        },
        {
          id: "finish",
          step: 2,
          title: "Finish, Don't Cook",
          description:
            "Add at the end of cooking to preserve its aroma and nutrients.",
        },
      ],
      tips: ["Store in a cool, dry place away from direct sunlight."],
    },

    faqs: [
      {
        id: "storage",
        question: "How should I store this ghee?",
        answer:
          "Store at room temperature, away from direct sunlight. Refrigeration is not required.",
      },
      {
        id: "shelf-life",
        question: "What is the shelf life?",
        answer:
          "Up to 12 months unopened, and 6 months once opened, when stored correctly.",
      },
    ],

    labHighlights: [
      {
        id: "purity",
        title: "99.7% Pure Milk Fat",
        description: "Independently lab-tested for purity and authenticity.",
        metric: "99.7%",
        source: "Third-party food lab, 2025",
      },
    ],

    reviews: [
      {
        id: "review-1",
        name: "Ananya R.",
        location: "New Delhi, India",
        review:
          "The aroma alone is worth it. You can tell this is the real thing.",
        rating: 5,
        verifiedPurchase: true,
        createdAt: "2026-05-14",
      },
    ],

    relatedProductSlugs: [],

    seo: {
      title: "Yak Ghee — Premium",
      description:
        "Pure, clarified yak ghee from 12,000 feet in Spiti Valley. Wood-fire clarified, nothing added.",
      ogImage: "/images/og/og-homepage.webp",
    },
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getAllProductSlugs(): string[] {
  return products.map((product) => product.slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getDefaultVariant(
  product: Product,
): ProductVariant | undefined {
  return (
    product.variants.find((variant) => variant.isDefault) ?? product.variants[0]
  );
}

export function getStartingPrice(product: Product): number | undefined {
  if (product.variants.length === 0) {
    return undefined;
  }

  return Math.min(...product.variants.map((variant) => variant.price));
}

export function getReviewMetrics(
  reviews: ProductReview[],
): ProductReviewMetrics {
  const ratingBreakdown: ProductReviewMetrics["ratingBreakdown"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  const ratingTotal = reviews.reduce((total, review) => {
    ratingBreakdown[review.rating] += 1;
    return total + review.rating;
  }, 0);

  return {
    averageRating: reviews.length === 0 ? 0 : ratingTotal / reviews.length,
    totalReviews: reviews.length,
    ratingBreakdown,
  };
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProductSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((related): related is Product => Boolean(related));
}
