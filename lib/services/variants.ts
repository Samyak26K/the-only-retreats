import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/services/audit";
import {
  productVariantCreateSchema,
  productVariantUpdateSchema,
} from "@/lib/validation/service-schemas";

export type ProductVariantRecord = {
  id: string;
  productId: string;
  name: string;
  sku: string;
  netQuantity: number | null;
  unit: string | null;
  mrp: number;
  sellingPrice: number;
  status: string;
  isDefault: boolean;
};

export async function listVariants(
  productId: string,
): Promise<ProductVariantRecord[]> {
  const variants = await prisma.productVariant.findMany({
    where: { productId },
    orderBy: { createdAt: "asc" },
  });

  return variants.map((variant) => ({
    ...variant,
    mrp: Number(variant.mrp),
    sellingPrice: Number(variant.sellingPrice),
    netQuantity: variant.netQuantity ? Number(variant.netQuantity) : null,
  }));
}

export async function createVariant(
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductVariantRecord> {
  const parsed = productVariantCreateSchema.parse(input);
  const variant = await prisma.productVariant.create({
    data: {
      productId: parsed.productId,
      name: parsed.name,
      sku: parsed.sku,
      netQuantity: parsed.netQuantity ?? undefined,
      unit: parsed.unit ?? undefined,
      mrp: parsed.mrp,
      sellingPrice: parsed.sellingPrice,
      status: parsed.status ?? "ACTIVE",
      isDefault: parsed.isDefault ?? false,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "create",
    entityType: "ProductVariant",
    entityId: variant.id,
    newState: variant,
  });

  return {
    ...variant,
    mrp: Number(variant.mrp),
    sellingPrice: Number(variant.sellingPrice),
    netQuantity: variant.netQuantity ? Number(variant.netQuantity) : null,
  };
}

export async function updateVariant(
  id: string,
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductVariantRecord> {
  const parsed = productVariantUpdateSchema.parse(input);
  const existing = await prisma.productVariant.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Variant not found");
  }

  const variant = await prisma.productVariant.update({
    where: { id },
    data: {
      name: parsed.name ?? undefined,
      sku: parsed.sku ?? undefined,
      netQuantity: parsed.netQuantity ?? undefined,
      unit: parsed.unit ?? undefined,
      mrp: parsed.mrp ?? undefined,
      sellingPrice: parsed.sellingPrice ?? undefined,
      status: parsed.status ?? undefined,
      isDefault: parsed.isDefault ?? undefined,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "update",
    entityType: "ProductVariant",
    entityId: variant.id,
    previousState: existing,
    newState: variant,
  });

  return {
    ...variant,
    mrp: Number(variant.mrp),
    sellingPrice: Number(variant.sellingPrice),
    netQuantity: variant.netQuantity ? Number(variant.netQuantity) : null,
  };
}
