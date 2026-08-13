import { z } from "zod";

const decimalInputSchema = z
  .union([z.number(), z.string()])
  .transform((value) => {
    if (typeof value === "number") {
      return value;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  })
  .refine((value) => Number.isFinite(value) && value >= 0, {
    message: "Value must be a non-negative number",
  });

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  categoryId: z.string().cuid().optional().nullable(),
  primaryOriginId: z.string().cuid().optional().nullable(),
  shortDescription: z.string().trim().max(400).optional().nullable(),
  longDescription: z.string().trim().max(6000).optional().nullable(),
  brand: z.string().trim().max(200).optional().nullable(),
  status: z
    .enum([
      "DRAFT",
      "ACTIVE",
      "COMING_SOON",
      "SEASONAL",
      "SOLD_OUT",
      "ARCHIVED",
    ])
    .optional(),
  featured: z.boolean().optional(),
  currency: z.string().trim().length(3).optional(),
  mrp: decimalInputSchema.optional().nullable(),
  sellingPrice: decimalInputSchema.optional().nullable(),
  costPrice: decimalInputSchema.optional().nullable(),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  seoDescription: z.string().trim().max(320).optional().nullable(),
});

export const productUpdateSchema = productCreateSchema.partial();

export const productVariantCreateSchema = z.object({
  productId: z.string().cuid(),
  name: z.string().trim().min(1).max(120),
  sku: z.string().trim().min(1).max(100),
  netQuantity: decimalInputSchema.optional().nullable(),
  unit: z.string().trim().max(20).optional().nullable(),
  mrp: decimalInputSchema,
  sellingPrice: decimalInputSchema,
  status: z.enum(["ACTIVE", "INACTIVE", "DISCONTINUED"]).optional(),
  isDefault: z.boolean().optional(),
});

export const productVariantUpdateSchema = productVariantCreateSchema
  .partial()
  .extend({
    productId: z.string().cuid().optional(),
  });

export const originCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  regionId: z.string().cuid(),
  villageId: z.string().cuid().optional().nullable(),
  altitude: z.string().trim().max(120).optional().nullable(),
  landscape: z.string().trim().max(240).optional().nullable(),
  climate: z.string().trim().max(240).optional().nullable(),
  biodiversity: z.string().trim().max(400).optional().nullable(),
  seasonality: z.string().trim().max(240).optional().nullable(),
  traditionalPractices: z.string().trim().max(600).optional().nullable(),
  historicalContext: z.string().trim().max(600).optional().nullable(),
  originStory: z.string().trim().max(4000).optional().nullable(),
  verificationStatus: z
    .enum(["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"])
    .optional(),
  isActive: z.boolean().optional(),
});

export const originUpdateSchema = originCreateSchema.partial().extend({
  regionId: z.string().cuid().optional(),
});

export const inventoryAdjustmentSchema = z.object({
  inventoryItemId: z.string().cuid(),
  quantityDelta: z
    .number()
    .finite()
    .refine((value) => value !== 0, {
      message: "quantityDelta must be non-zero",
    }),
  movementType: z
    .enum([
      "PURCHASE",
      "PRODUCTION",
      "PACKING",
      "SALE",
      "ADJUSTMENT",
      "RETURN",
      "DAMAGE",
      "CANCELLATION",
    ])
    .optional(),
  referenceType: z.string().trim().max(100).optional().nullable(),
  referenceId: z.string().trim().max(100).optional().nullable(),
  reason: z.string().trim().max(200).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});

export const customerCreateSchema = z.object({
  clerkUserId: z.string().trim().min(1),
  firstName: z.string().trim().max(100).optional().nullable(),
  lastName: z.string().trim().max(100).optional().nullable(),
  email: z.string().trim().email().optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
});

export const customerUpdateSchema = customerCreateSchema.partial().extend({
  clerkUserId: z.string().trim().min(1).optional(),
});
