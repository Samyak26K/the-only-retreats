// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("../lib/generated/prisma");

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not configured. Skipping seed.");
    return;
  }

  const country = await prisma.country.upsert({
    where: { name: "India" },
    update: {},
    create: { name: "India", code: "IN" },
  });

  const himachal = await prisma.state.upsert({
    where: {
      countryId_name: { countryId: country.id, name: "Himachal Pradesh" },
    },
    update: {},
    create: { countryId: country.id, name: "Himachal Pradesh", code: "HP" },
  });

  const kullu = await prisma.district.upsert({
    where: { stateId_name: { stateId: himachal.id, name: "Kullu" } },
    update: {},
    create: { stateId: himachal.id, name: "Kullu" },
  });

  const kulluValley = await prisma.region.upsert({
    where: { districtId_name: { districtId: kullu.id, name: "Kullu Valley" } },
    update: {},
    create: {
      districtId: kullu.id,
      name: "Kullu Valley",
      description:
        "Development/demo Himalayan valley context for heritage seed data.",
    },
  });

  const pulag = await prisma.village.upsert({
    where: { regionId_name: { regionId: kulluValley.id, name: "Pulag" } },
    update: {},
    create: {
      regionId: kulluValley.id,
      name: "Pulag",
      description: "Development/demo village entry.",
    },
  });

  await prisma.village.upsert({
    where: { regionId_name: { regionId: kulluValley.id, name: "Rumsu" } },
    update: {},
    create: {
      regionId: kulluValley.id,
      name: "Rumsu",
      description: "Development/demo village entry.",
    },
  });

  await prisma.village.upsert({
    where: { regionId_name: { regionId: kulluValley.id, name: "Hallan" } },
    update: {},
    create: {
      regionId: kulluValley.id,
      name: "Hallan",
      description: "Development/demo village entry.",
    },
  });

  const productionMethod = await prisma.productionMethod.upsert({
    where: { name: "Traditional bilona and wood-fire clarification" },
    update: {},
    create: {
      name: "Traditional bilona and wood-fire clarification",
      description: "Development/demo production method for heritage seed data.",
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: "ghee" },
    update: {},
    create: {
      name: "Ghee",
      slug: "ghee",
      description: "Development/demo category for Himalayan ghee products.",
    },
  });

  const origin = await prisma.origin.upsert({
    where: {
      name_regionId: {
        name: "Himalayan Badri Cow Ghee Origin",
        regionId: kulluValley.id,
      },
    },
    update: {},
    create: {
      name: "Himalayan Badri Cow Ghee Origin",
      region: { connect: { id: kulluValley.id } },
      village: { connect: { id: pulag.id } },
      altitude: "2,460 m",
      landscape: "Development/demo Himalayan valley landscape",
      climate: "Cool mountain climate",
      biodiversity: "Development/demo biodiversity context",
      seasonality: "Development/demo seasonal context",
      traditionalPractices: "Development/demo heritage practice context",
      historicalContext: "Development/demo historical context",
      originStory:
        "Development/demo origin story for seed data. Replace with authenticated product information when available.",
      verificationStatus: "PENDING",
    },
  });

  const product = await prisma.product.upsert({
    where: { slug: "himalayan-badri-cow-ghee" },
    update: {},
    create: {
      category: { connect: { id: category.id } },
      primaryOrigin: { connect: { id: origin.id } },
      name: "Himalayan Badri Cow Ghee",
      slug: "himalayan-badri-cow-ghee",
      shortDescription:
        "Development/demo Himalayan ghee product for backend foundation work.",
      longDescription:
        "Development/demo content derived from the repository brand narrative for Himalayan Badri Cow Ghee.",
      brand: "The Only Retreats",
      status: "ACTIVE",
      featured: true,
      currency: "INR",
      mrp: 1600,
      sellingPrice: 1050,
      costPrice: 620,
      seoTitle: "Himalayan Badri Cow Ghee",
      seoDescription: "Development/demo product entry for The Only Retreats.",
    },
  });

  const variant500 = await prisma.productVariant.upsert({
    where: { sku: "HIMALAYANBADRICOWGHEE500" },
    update: {},
    create: {
      product: { connect: { id: product.id } },
      name: "500 ml",
      sku: "HIMALAYANBADRICOWGHEE500",
      netQuantity: 500,
      unit: "ml",
      mrp: 1600,
      sellingPrice: 1050,
      status: "ACTIVE",
      isDefault: true,
    },
  });

  const variant1000 = await prisma.productVariant.upsert({
    where: { sku: "HIMALAYANBADRICOWGHEE1000" },
    update: {},
    create: {
      product: { connect: { id: product.id } },
      name: "1000 ml",
      sku: "HIMALAYANBADRICOWGHEE1000",
      netQuantity: 1000,
      unit: "ml",
      mrp: 3000,
      sellingPrice: 1850,
      status: "ACTIVE",
      isDefault: false,
    },
  });

  const productionRecord = await prisma.productionRecord.create({
    data: {
      producer: {
        create: {
          name: "Development Demo Producer",
          village: { connect: { id: pulag.id } },
          relationshipStatus: "Development/demo",
          notes: "Development/demo producer record for seed data.",
          verificationStatus: "PENDING",
        },
      },
      origin: { connect: { id: origin.id } },
      productionMethod: { connect: { id: productionMethod.id } },
      product: { connect: { id: product.id } },
      productionDate: new Date("2024-09-01T00:00:00.000Z"),
      productionPeriod: "Development/demo harvest period",
      notes: "Development/demo production record for seed data.",
      qualityStatus: "PENDING",
      verificationStatus: "PENDING",
    },
  });

  await prisma.batch.create({
    data: {
      product: { connect: { id: product.id } },
      productionRecord: { connect: { id: productionRecord.id } },
      batchNumber: "DEV-BATCH-001",
      productionDate: new Date("2024-09-01T00:00:00.000Z"),
      quantityProduced: 100,
      qualityStatus: "PENDING",
      verificationStatus: "PENDING",
      notes: "Development/demo batch for seed data.",
    },
  });

  const inventoryLocation = await prisma.inventoryLocation.upsert({
    where: { id: "development-warehouse" },
    update: {},
    create: {
      id: "development-warehouse",
      name: "Development Warehouse",
      type: "WAREHOUSE",
      address: "Development/demo warehouse location",
      isActive: true,
    },
  });

  await prisma.inventoryItem.upsert({
    where: {
      productVariantId_inventoryLocationId: {
        productVariantId: variant500.id,
        inventoryLocationId: inventoryLocation.id,
      },
    },
    update: {},
    create: {
      productVariant: { connect: { id: variant500.id } },
      inventoryLocation: { connect: { id: inventoryLocation.id } },
      quantityOnHand: 12,
      quantityReserved: 2,
      reorderThreshold: 5,
      status: "ACTIVE",
    },
  });

  await prisma.inventoryItem.upsert({
    where: {
      productVariantId_inventoryLocationId: {
        productVariantId: variant1000.id,
        inventoryLocationId: inventoryLocation.id,
      },
    },
    update: {},
    create: {
      productVariant: { connect: { id: variant1000.id } },
      inventoryLocation: { connect: { id: inventoryLocation.id } },
      quantityOnHand: 8,
      quantityReserved: 1,
      reorderThreshold: 3,
      status: "ACTIVE",
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
