import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/services/audit";
import {
  productVariantCreateSchema,
  productVariantUpdateSchema,
} from "@/lib/validation/service-schemas";
import { z } from "zod";

const cuidSchema = z.string().cuid();

function toNumber(value: unknown) {
  return typeof value === "number" ? value : Number(value);
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

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
  quantityOnHand: number;
  quantityReserved: number;
  availableQuantity: number;
  inventoryItemCount: number;
};

export async function listVariants(
  productId: string,
): Promise<ProductVariantRecord[]> {
  const parsedProductId = cuidSchema.safeParse(productId);

  if (!parsedProductId.success) {
    return [];
  }

  const variants = await prisma.productVariant.findMany({
    where: { productId: parsedProductId.data },
    orderBy: { createdAt: "asc" },
    include: {
      inventoryItems: {
        select: {
          quantityOnHand: true,
          quantityReserved: true,
        },
      },
    },
  });

  return variants.map((variant) => ({
    id: variant.id,
    productId: variant.productId,
    name: variant.name,
    sku: variant.sku,
    unit: variant.unit,
    status: variant.status,
    isDefault: variant.isDefault,
    mrp: Number(variant.mrp),
    sellingPrice: Number(variant.sellingPrice),
    netQuantity: variant.netQuantity ? Number(variant.netQuantity) : null,
    quantityOnHand: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityOnHand),
      0,
    ),
    quantityReserved: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityReserved),
      0,
    ),
    availableQuantity:
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityOnHand),
        0,
      ) -
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityReserved),
        0,
      ),
    inventoryItemCount: variant.inventoryItems.length,
  }));
}

export async function createVariant(
  productId: string,
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductVariantRecord> {
  const parsedProductId = cuidSchema.parse(productId);
  const parsed = productVariantCreateSchema
    .omit({ productId: true })
    .parse(input);

  const product = await prisma.product.findUnique({
    where: { id: parsedProductId },
    select: { id: true },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let variant;

  try {
    variant = await prisma.$transaction(async (tx) => {
      const status = parsed.status ?? "ACTIVE";
      const isDefault =
        (parsed.isDefault ?? false) && status !== "DISCONTINUED";

      if (isDefault) {
        await tx.productVariant.updateMany({
          where: { productId: parsedProductId },
          data: { isDefault: false },
        });
      }

      return tx.productVariant.create({
        data: {
          productId: parsedProductId,
          name: parsed.name,
          sku: parsed.sku,
          netQuantity:
            parsed.netQuantity === undefined ? undefined : parsed.netQuantity,
          unit: parsed.unit ?? undefined,
          mrp: parsed.mrp,
          sellingPrice: parsed.sellingPrice,
          status,
          isDefault,
        },
        include: {
          inventoryItems: {
            select: {
              quantityOnHand: true,
              quantityReserved: true,
            },
          },
        },
      });
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new Error("SKU already exists");
    }

    throw error;
  }

  await recordAuditLog({
    actor: options?.actor,
    action: "create",
    entityType: "ProductVariant",
    entityId: variant.id,
    newState: variant,
  });

  return {
    id: variant.id,
    productId: variant.productId,
    name: variant.name,
    sku: variant.sku,
    unit: variant.unit,
    status: variant.status,
    isDefault: variant.isDefault,
    mrp: Number(variant.mrp),
    sellingPrice: Number(variant.sellingPrice),
    netQuantity: variant.netQuantity ? Number(variant.netQuantity) : null,
    quantityOnHand: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityOnHand),
      0,
    ),
    quantityReserved: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityReserved),
      0,
    ),
    availableQuantity:
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityOnHand),
        0,
      ) -
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityReserved),
        0,
      ),
    inventoryItemCount: variant.inventoryItems.length,
  };
}

export async function updateVariant(
  productId: string,
  id: string,
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductVariantRecord> {
  const parsedProductId = cuidSchema.parse(productId);
  const parsedVariantId = cuidSchema.parse(id);
  const parsed = productVariantUpdateSchema
    .omit({ productId: true })
    .parse(input);
  const existing = await prisma.productVariant.findUnique({
    where: { id: parsedVariantId },
    include: {
      inventoryItems: {
        select: {
          quantityOnHand: true,
          quantityReserved: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Variant not found");
  }

  if (existing.productId !== parsedProductId) {
    throw new Error("Variant does not belong to product");
  }

  let variant;

  try {
    variant = await prisma.$transaction(async (tx) => {
      const nextStatus = parsed.status ?? existing.status;
      const shouldBeDefault =
        parsed.isDefault === true && nextStatus !== "DISCONTINUED";
      const clearsDefault =
        nextStatus === "DISCONTINUED" || parsed.isDefault === false;

      if (shouldBeDefault) {
        await tx.productVariant.updateMany({
          where: {
            productId: parsedProductId,
            id: { not: parsedVariantId },
          },
          data: { isDefault: false },
        });
      }

      const updatedVariant = await tx.productVariant.update({
        where: { id: parsedVariantId },
        data: {
          name: parsed.name ?? undefined,
          sku: parsed.sku ?? undefined,
          netQuantity:
            parsed.netQuantity === undefined ? undefined : parsed.netQuantity,
          unit: parsed.unit ?? undefined,
          mrp: parsed.mrp ?? undefined,
          sellingPrice: parsed.sellingPrice ?? undefined,
          status: parsed.status ?? undefined,
          isDefault: shouldBeDefault ? true : clearsDefault ? false : undefined,
        },
        include: {
          inventoryItems: {
            select: {
              quantityOnHand: true,
              quantityReserved: true,
            },
          },
        },
      });

      if (nextStatus === "DISCONTINUED" && existing.isDefault) {
        const replacement = await tx.productVariant.findFirst({
          where: {
            productId: parsedProductId,
            id: { not: parsedVariantId },
            status: "ACTIVE",
          },
          orderBy: { createdAt: "asc" },
          select: { id: true },
        });

        if (replacement) {
          await tx.productVariant.updateMany({
            where: { productId: parsedProductId },
            data: { isDefault: false },
          });
          await tx.productVariant.update({
            where: { id: replacement.id },
            data: { isDefault: true },
          });
        }
      }

      return updatedVariant;
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new Error("SKU already exists");
    }

    throw error;
  }

  await recordAuditLog({
    actor: options?.actor,
    action: "update",
    entityType: "ProductVariant",
    entityId: variant.id,
    previousState: existing,
    newState: variant,
  });

  return {
    id: variant.id,
    productId: variant.productId,
    name: variant.name,
    sku: variant.sku,
    unit: variant.unit,
    status: variant.status,
    isDefault: variant.isDefault,
    mrp: Number(variant.mrp),
    sellingPrice: Number(variant.sellingPrice),
    netQuantity: variant.netQuantity ? Number(variant.netQuantity) : null,
    quantityOnHand: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityOnHand),
      0,
    ),
    quantityReserved: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityReserved),
      0,
    ),
    availableQuantity:
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityOnHand),
        0,
      ) -
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityReserved),
        0,
      ),
    inventoryItemCount: variant.inventoryItems.length,
  };
}

export async function deactivateVariant(
  productId: string,
  id: string,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<ProductVariantRecord> {
  const parsedProductId = cuidSchema.parse(productId);
  const parsedVariantId = cuidSchema.parse(id);

  const existing = await prisma.productVariant.findUnique({
    where: { id: parsedVariantId },
    include: {
      inventoryItems: {
        select: {
          quantityOnHand: true,
          quantityReserved: true,
        },
      },
    },
  });

  if (!existing) {
    throw new Error("Variant not found");
  }

  if (existing.productId !== parsedProductId) {
    throw new Error("Variant does not belong to product");
  }

  const variant = await prisma.$transaction(async (tx) => {
    const updatedVariant = await tx.productVariant.update({
      where: { id: parsedVariantId },
      data: {
        status: "DISCONTINUED",
        isDefault: false,
      },
      include: {
        inventoryItems: {
          select: {
            quantityOnHand: true,
            quantityReserved: true,
          },
        },
      },
    });

    if (existing.isDefault) {
      const replacement = await tx.productVariant.findFirst({
        where: {
          productId: parsedProductId,
          id: { not: parsedVariantId },
          status: "ACTIVE",
        },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });

      if (replacement) {
        await tx.productVariant.updateMany({
          where: { productId: parsedProductId },
          data: { isDefault: false },
        });
        await tx.productVariant.update({
          where: { id: replacement.id },
          data: { isDefault: true },
        });
      }
    }

    return updatedVariant;
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "deactivate",
    entityType: "ProductVariant",
    entityId: variant.id,
    previousState: existing,
    newState: variant,
  });

  return {
    id: variant.id,
    productId: variant.productId,
    name: variant.name,
    sku: variant.sku,
    unit: variant.unit,
    status: variant.status,
    isDefault: variant.isDefault,
    mrp: Number(variant.mrp),
    sellingPrice: Number(variant.sellingPrice),
    netQuantity: variant.netQuantity ? Number(variant.netQuantity) : null,
    quantityOnHand: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityOnHand),
      0,
    ),
    quantityReserved: variant.inventoryItems.reduce(
      (total, item) => total + toNumber(item.quantityReserved),
      0,
    ),
    availableQuantity:
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityOnHand),
        0,
      ) -
      variant.inventoryItems.reduce(
        (total, item) => total + toNumber(item.quantityReserved),
        0,
      ),
    inventoryItemCount: variant.inventoryItems.length,
  };
}
