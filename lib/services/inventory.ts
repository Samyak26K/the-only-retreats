import { prisma } from "@/lib/prisma";
import { recordAuditLog } from "@/lib/services/audit";
import { inventoryAdjustmentSchema } from "@/lib/validation/service-schemas";

export type InventorySummary = {
  id: string;
  productVariantId: string;
  inventoryLocationId: string;
  quantityOnHand: number;
  quantityReserved: number;
  reorderThreshold: number | null;
  status: string;
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

export async function getInventory(
  productVariantId?: string,
): Promise<InventorySummary[]> {
  const inventoryItems = await prisma.inventoryItem.findMany({
    where: productVariantId ? { productVariantId } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return inventoryItems.map((item) => ({
    ...item,
    quantityOnHand: Number(item.quantityOnHand),
    quantityReserved: Number(item.quantityReserved),
    reorderThreshold: item.reorderThreshold
      ? Number(item.reorderThreshold)
      : null,
  }));
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

  return {
    ...updated,
    quantityOnHand: Number(updated.quantityOnHand),
    quantityReserved: Number(updated.quantityReserved),
    reorderThreshold: updated.reorderThreshold
      ? Number(updated.reorderThreshold)
      : null,
  };
}
