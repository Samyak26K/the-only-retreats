import { cache } from "react";

import type {
  InventoryStatus,
  Product,
  ProductCategory,
  ProductMedia,
  ProductStatus,
  ProductVariant,
} from "@/lib/content/product";
import { prisma } from "@/lib/prisma";

const PUBLIC_PRODUCT_STATUSES = [
  "ACTIVE",
  "COMING_SOON",
  "SEASONAL",
  "SOLD_OUT",
] as const;

const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  "ghee",
  "honey",
  "butter",
  "spice-blend",
  "tea",
  "other",
];

/** Existing committed public asset; product photography is not in the repo yet. */
const FALLBACK_HERO_IMAGE = "/file.svg";

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value);
}

function mapProductStatus(status: string): ProductStatus {
  switch (status) {
    case "COMING_SOON":
      return "comingSoon";
    case "SEASONAL":
      return "seasonal";
    case "SOLD_OUT":
      return "soldOut";
    default:
      return "active";
  }
}

function mapCategory(slug: string | null | undefined): ProductCategory {
  if (!slug) {
    return "other";
  }

  return PRODUCT_CATEGORIES.includes(slug as ProductCategory)
    ? (slug as ProductCategory)
    : "other";
}

function formatOrigin(
  origin: {
    name: string;
    region: { name: string } | null;
  } | null,
): string {
  if (!origin) {
    return "";
  }

  if (origin.region?.name) {
    return `${origin.name}, ${origin.region.name}`;
  }

  return origin.name;
}

function mapMedia(
  media: Array<{
    id: string;
    type: string | null;
    url: string;
    alt: string | null;
  }>,
): ProductMedia[] {
  return media
    .filter((item) => item.url.trim().length > 0)
    .map((item) => {
      const alt = item.alt?.trim() || "";

      if (item.type?.trim().toLowerCase() === "video") {
        return {
          id: item.id,
          type: "video" as const,
          src: item.url,
          alt,
        };
      }

      return {
        id: item.id,
        type: "image" as const,
        src: item.url,
        alt,
      };
    });
}

function getAvailableQuantity(
  inventoryItems: Array<{
    quantityOnHand: unknown;
    quantityReserved: unknown;
  }>,
) {
  return inventoryItems.reduce((total, item) => {
    return (
      total + toNumber(item.quantityOnHand) - toNumber(item.quantityReserved)
    );
  }, 0);
}

function isVariantLowStock(
  inStock: boolean,
  inventoryItems: Array<{
    quantityOnHand: unknown;
    quantityReserved: unknown;
    reorderThreshold: unknown;
  }>,
) {
  if (!inStock) {
    return false;
  }

  return inventoryItems.some((item) => {
    const threshold = item.reorderThreshold
      ? toNumber(item.reorderThreshold)
      : null;

    if (threshold === null || !Number.isFinite(threshold)) {
      return false;
    }

    const available =
      toNumber(item.quantityOnHand) - toNumber(item.quantityReserved);

    return available <= threshold;
  });
}

function mapVariants(
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    mrp: unknown;
    sellingPrice: unknown;
    status: string;
    isDefault: boolean;
    inventoryItems: Array<{
      quantityOnHand: unknown;
      quantityReserved: unknown;
      reorderThreshold: unknown;
    }>;
  }>,
): ProductVariant[] {
  return variants.map((variant) => {
    const sellingPrice = toNumber(variant.sellingPrice);
    const mrp = toNumber(variant.mrp);
    const availableQuantity = getAvailableQuantity(variant.inventoryItems);

    return {
      id: variant.id,
      label: variant.name,
      price: sellingPrice,
      compareAtPrice:
        Number.isFinite(mrp) && mrp > sellingPrice ? mrp : undefined,
      sku: variant.sku,
      inStock: variant.status === "ACTIVE" && availableQuantity > 0,
      isDefault: variant.isDefault,
    };
  });
}

function mapInventoryStatus(
  variants: Array<{
    status: string;
    inventoryItems: Array<{
      quantityOnHand: unknown;
      quantityReserved: unknown;
      reorderThreshold: unknown;
    }>;
  }>,
): InventoryStatus {
  const stockStates = variants.map((variant) => {
    const availableQuantity = getAvailableQuantity(variant.inventoryItems);
    const inStock = variant.status === "ACTIVE" && availableQuantity > 0;

    return {
      inStock,
      isLowStock: isVariantLowStock(inStock, variant.inventoryItems),
    };
  });
  const inStockVariants = stockStates.filter((variant) => variant.inStock);

  if (inStockVariants.length === 0) {
    return "outOfStock";
  }

  if (inStockVariants.every((variant) => variant.isLowStock)) {
    return "lowStock";
  }

  return "inStock";
}

export const getPublishedProductBySlug = cache(
  async function getPublishedProductBySlug(
    slug: string,
  ): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: {
        slug,
        status: { in: [...PUBLIC_PRODUCT_STATUSES] },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        featured: true,
        currency: true,
        shortDescription: true,
        longDescription: true,
        seoTitle: true,
        seoDescription: true,
        category: {
          select: {
            slug: true,
          },
        },
        primaryOrigin: {
          select: {
            id: true,
            name: true,
            altitude: true,
            seasonality: true,
            region: {
              select: {
                name: true,
              },
            },
          },
        },
        variants: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            sku: true,
            mrp: true,
            sellingPrice: true,
            status: true,
            isDefault: true,
            inventoryItems: {
              select: {
                quantityOnHand: true,
                quantityReserved: true,
                reorderThreshold: true,
              },
            },
          },
        },
        media: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            type: true,
            url: true,
            alt: true,
          },
        },
        passport: {
          select: {
            originSummary: true,
            peopleSummary: true,
            seasonalitySummary: true,
            traceabilitySummary: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    const origin = formatOrigin(product.primaryOrigin);
    const media = mapMedia(product.media);
    const mappedVariants = mapVariants(product.variants);
    const firstImage = media.find((item) => item.type === "image");
    const heroSrc = firstImage?.src ?? FALLBACK_HERO_IMAGE;
    const heroAlt = firstImage?.alt || product.name;
    const storyBody =
      product.longDescription?.trim() || product.shortDescription?.trim() || "";

    const isGhee =
      product.slug.includes("ghee") ||
      product.name.toLowerCase().includes("ghee");

    const honeyJourney = [
      {
        id: "forage",
        title: "The Bees Forage",
        description:
          "Wild bees collect nectar from alpine flowers blooming at 10,000 feet — thyme, rhododendron, and wild herbs found nowhere else.",
        image: "/images/valleys/lahaul.webp",
        location: "Lahaul Valley, 3,050m",
      },
      {
        id: "harvest",
        title: "Single Harvest",
        description:
          "Harvested once a year during the brief flowering season. No second harvest. No blending with other regions.",
        image: "/images/valleys/kullu.webp",
        location: "Himachal Pradesh",
      },
      {
        id: "raw",
        title: "Raw & Unfiltered",
        description:
          "Never heated above ambient temperature. Coarsely filtered only to remove debris. All enzymes, pollen and propolis intact.",
        image: "/images/valleys/nubra.webp",
        location: "Small batch processing",
      },
      {
        id: "bottled",
        title: "Glass Bottled",
        description:
          "Filled into amber glass jars to protect from light. No plastic. No additives. Sealed and dated by batch.",
        image: "/images/valleys/zanskar.webp",
        location: "Artisan packing",
      },
      {
        id: "delivered",
        title: "From Himalayas",
        description:
          "Shipped directly from source to your home. No middlemen. Traceable to the beekeeper family and valley of origin.",
        image: "/images/valleys/changthang.webp",
        location: "Direct to you",
      },
    ];

    const gheeJourney = [
      {
        id: "graze",
        title: "The Herd Grazes",
        description:
          "Indigenous cows graze freely on Himalayan pastures at 2,400–4,000 metres. The altitude, herbs and open grazing define the milk.",
        image: "/images/valleys/kullu.webp",
        location: "Kullu & Spiti Valley",
      },
      {
        id: "milk",
        title: "Morning Milking",
        description:
          "Milk is collected by hand each morning by herding families. No machines, no industrial process. Just the relationship between family and animal.",
        image: "/images/valleys/lahaul.webp",
        location: "Village farms",
      },
      {
        id: "curd",
        title: "Curd & Culture",
        description:
          "Fresh milk is cultured into curd using traditional starters passed down through families. This step is what separates Bilona ghee from all others.",
        image: "/images/valleys/zanskar.webp",
        location: "Artisan processing",
      },
      {
        id: "churn",
        title: "Hand Churned",
        description:
          "Curd is hand-churned the traditional way — slowly, by hand — to separate butter. This is the Bilona method, unchanged for centuries.",
        image: "/images/valleys/nubra.webp",
        location: "Traditional method",
      },
      {
        id: "clarify",
        title: "Slow Clarified",
        description:
          "Butter is slow-cooked over a wood fire until golden and pure. No shortcuts. The result is ghee that carries the memory of every step before it.",
        image: "/images/valleys/changthang.webp",
        location: "Direct to you",
      },
    ];

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      tagline: product.shortDescription?.trim() || product.name,
      category: mapCategory(product.category?.slug),
      currency: product.currency,
      origin,
      status: mapProductStatus(product.status),
      inventoryStatus: mapInventoryStatus(product.variants),
      featured: product.featured,
      hero: {
        media: {
          desktop: heroSrc,
          mobile: heroSrc,
          alt: heroAlt,
        },
      },
      media,
      variants: mappedVariants,
      highlights: [],
      story: {
        title: product.name,
        body: storyBody,
        image: "",
      },
      shloka: {
        devanagari: "",
        transliteration: "",
        translation: "",
      },
      originJourney: isGhee ? gheeJourney : honeyJourney,
      productPassport: {
        originId: product.primaryOrigin?.id ?? "",
        region: product.passport?.originSummary?.trim() || origin,
        altitude: product.primaryOrigin?.altitude?.trim() || undefined,
        harvestSeason:
          product.passport?.seasonalitySummary?.trim() ||
          product.primaryOrigin?.seasonality?.trim() ||
          undefined,
        community: product.passport?.peopleSummary?.trim() || undefined,
        traceabilityCode:
          product.passport?.traceabilitySummary?.trim() || undefined,
      },
      tasteProfile: {
        summary: "",
        attributes: [],
      },
      nutrition: {
        servingSize: "",
        facts: [],
      },
      certifications: [],
      ritualGuide: {
        title: "",
        steps: [],
      },
      faqs: [],
      labHighlights: [],
      reviews: [],
      relatedProductSlugs: [],
      seo: {
        title: product.seoTitle?.trim() || product.name,
        description:
          product.seoDescription?.trim() ||
          product.shortDescription?.trim() ||
          product.name,
      },
    };
  },
);
