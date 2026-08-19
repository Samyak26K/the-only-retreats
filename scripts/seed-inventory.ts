import { prisma } from "../lib/prisma";

async function main() {
  // Create inventory location
  const location = await prisma.inventoryLocation.upsert({
    where: { id: "main-warehouse" },
    update: {},
    create: {
      id: "main-warehouse",
      name: "Main Warehouse",
      type: "warehouse",
      isActive: true,
    },
  });

  // Get all active variants
  const variants = await prisma.productVariant.findMany({
    where: { status: "ACTIVE" },
  });

  // Create inventory for each variant
  for (const variant of variants) {
    await prisma.inventoryItem.upsert({
      where: {
        productVariantId_inventoryLocationId: {
          productVariantId: variant.id,
          inventoryLocationId: location.id,
        },
      },
      update: {},
      create: {
        productVariantId: variant.id,
        inventoryLocationId: location.id,
        quantityOnHand: 50,
        quantityReserved: 0,
        status: "ACTIVE",
      },
    });
  }

  console.log("Inventory seeded for", variants.length, "variants");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
