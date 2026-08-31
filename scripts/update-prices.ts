import { prisma } from "../lib/prisma";

async function main() {
  console.log("Updating prices...");

  // Grand Rasoi Set — ₹26,499
  await prisma.productVariant.updateMany({
    where: { product: { slug: "grand-rasoi-set" } },
    data: { sellingPrice: 26499 },
  });
  console.log("✓ Grand Rasoi Set → ₹26,499");

  // Yak Ghee — ₹12,000 for all variants
  await prisma.productVariant.updateMany({
    where: { product: { slug: "himalayan-vedic-yak-ghee" } },
    data: { sellingPrice: 12000 },
  });
  console.log("✓ Yak Ghee → ₹12,000");

  // Cow Ghee — ₹4,180 for default variant
  await prisma.productVariant.updateMany({
    where: {
      product: { slug: "himalayan-vedic-ghee" },
      isDefault: true,
    },
    data: { sellingPrice: 4180 },
  });
  console.log("✓ Cow Ghee → ₹4,180");

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
