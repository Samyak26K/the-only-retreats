import { prisma } from "@/lib/prisma";
import { timeAdminStage } from "@/lib/server/dev-timing";
import { recordAuditLog } from "@/lib/services/audit";
import { inventoryAdjustmentSchema } from "@/lib/validation/service-schemas";

export type InventoryStockStatus = "healthy" | "low-stock" | "out-of-stock";

export type InventorySummary = {
  id: string;
  productVariantId: string;
  inventoryLocationId: string;
  quantityOnHand: number;
  quantityReserved: number;
  reorderThreshold: number | null;
  status: string;
  availableQuantity: number;
  stockStatus: InventoryStockStatus;
  lastUpdated: Date;
  productName: string | null;
  variantName: string | null;
  variantSku: string | null;
  locationName: string | null;
};

export type InventoryMovementRecord = {
  id: string;
  inventoryItemId: string;
  movementType: string;
  quantity: number;
  referenceType: string | null;
  referenceId: string | null;
  reason: string | null;
  notes: string | null;
  createdAt: Date;
};

export function resolveInventoryStockStatus(
  quantityOnHand: number,
  reorderThreshold: number | null,
): InventoryStockStatus {
  if (quantityOnHand <= 0) {
    return "out-of-stock";
  }

  if (reorderThreshold !== null && quantityOnHand <= reorderThreshold) {
    return "low-stock";
  }

  return "healthy";
}

export async function getInventory(filters?: {
  q?: string;
  stockStatus?: InventoryStockStatus | "";
  locationId?: string;
  productVariantId?: string;
}): Promise<InventorySummary[]> {
  return timeAdminStage("prisma.getInventory", async () => {
    const trimmedQuery = filters?.q?.trim();

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        ...(filters?.productVariantId
          ? { productVariantId: filters.productVariantId }
          : {}),
        ...(filters?.locationId
          ? { inventoryLocationId: filters.locationId }
          : {}),
        ...(trimmedQuery
          ? {
              OR: [
                {
                  productVariant: {
                    product: {
                      name: { contains: trimmedQuery, mode: "insensitive" },
                    },
                  },
                },
                {
                  productVariant: {
                    name: { contains: trimmedQuery, mode: "insensitive" },
                  },
                },
                {
                  productVariant: {
                    sku: { contains: trimmedQuery, mode: "insensitive" },
                  },
                },
                {
                  inventoryLocation: {
                    name: { contains: trimmedQuery, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
        inventoryLocation: true,
      },
    });

    const mappedItems = inventoryItems.map((item) => {
      const quantityOnHand = Number(item.quantityOnHand);
      const quantityReserved = Number(item.quantityReserved);
      const reorderThreshold = item.reorderThreshold
        ? Number(item.reorderThreshold)
        : null;
      const availableQuantity = quantityOnHand - quantityReserved;
      const stockStatus = resolveInventoryStockStatus(
        quantityOnHand,
        reorderThreshold,
      );

      return {
        id: item.id,
        productVariantId: item.productVariantId,
        inventoryLocationId: item.inventoryLocationId,
        quantityOnHand,
        quantityReserved,
        reorderThreshold,
        status: item.status,
        availableQuantity,
        stockStatus,
        lastUpdated: item.updatedAt,
        productName: item.productVariant.product?.name ?? null,
        variantName: item.productVariant.name ?? null,
        variantSku: item.productVariant.sku ?? null,
        locationName: item.inventoryLocation.name ?? null,
      };
    });

    const normalizedStockStatus = filters?.stockStatus;
    if (normalizedStockStatus) {
      return mappedItems.filter(
        (item) => item.stockStatus === normalizedStockStatus,
      );
    }

    return mappedItems;
  });
}

export async function getInventoryMovements(
  inventoryItemId: string,
): Promise<InventoryMovementRecord[]> {
  const movements = await prisma.inventoryMovement.findMany({
    where: { inventoryItemId },
    orderBy: { createdAt: "desc" },
  });

  return movements.map((movement) => ({
    ...movement,
    quantity: Number(movement.quantity),
    createdAt: movement.createdAt,
  }));
}

export async function adjustInventory(
  input: unknown,
  options?: {
    actor?: { id?: string | null; email?: string | null; role?: string | null };
  },
): Promise<InventorySummary> {
  const parsed = inventoryAdjustmentSchema.parse(input);
  const inventoryItem = await prisma.inventoryItem.findUnique({
    where: { id: parsed.inventoryItemId },
    include: {
      productVariant: {
        include: {
          product: true,
        },
      },
      inventoryLocation: true,
    },
  });

  if (!inventoryItem) {
    throw new Error("Inventory item not found");
  }

  const nextQuantity =
    Number(inventoryItem.quantityOnHand) + parsed.quantityDelta;
  const updated = await prisma.inventoryItem.update({
    where: { id: parsed.inventoryItemId },
    data: {
      quantityOnHand: nextQuantity,
      updatedAt: new Date(),
    },
  });

  const movement = await prisma.inventoryMovement.create({
    data: {
      inventoryItemId: parsed.inventoryItemId,
      movementType: parsed.movementType ?? "ADJUSTMENT",
      quantity: parsed.quantityDelta,
      referenceType: parsed.referenceType ?? undefined,
      referenceId: parsed.referenceId ?? undefined,
      reason: parsed.reason ?? undefined,
      notes: parsed.notes ?? undefined,
    },
  });

  await recordAuditLog({
    actor: options?.actor,
    action: "adjust",
    entityType: "InventoryItem",
    entityId: inventoryItem.id,
    previousState: inventoryItem,
    newState: updated,
    metadata: { movementId: movement.id },
  });

  const quantityOnHand = Number(updated.quantityOnHand);
  const quantityReserved = Number(updated.quantityReserved);
  const reorderThreshold = updated.reorderThreshold
    ? Number(updated.reorderThreshold)
    : null;

  return {
    id: updated.id,
    productVariantId: updated.productVariantId,
    inventoryLocationId: updated.inventoryLocationId,
    quantityOnHand,
    quantityReserved,
    reorderThreshold,
    status: updated.status,
    availableQuantity: quantityOnHand - quantityReserved,
    stockStatus: resolveInventoryStockStatus(quantityOnHand, reorderThreshold),
    lastUpdated: updated.updatedAt,
    productName: inventoryItem.productVariant.product?.name ?? null,
    variantName: inventoryItem.productVariant.name ?? null,
    variantSku: inventoryItem.productVariant.sku ?? null,
    locationName: inventoryItem.inventoryLocation.name ?? null,
  };
}
