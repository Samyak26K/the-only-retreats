import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding products...");

  const products = [
    {
      name: "Himalayan Vedic Yak Ghee",
      slug: "himalayan-vedic-yak-ghee",
      brand: "Himalayan",
      category: "Ghee",
      origin: "High Himalayan yak-grazing regions",
      altitude: "3,200–4,000 m",
      region: "High Himalayan Pastures",
      shortDescription:
        "Traditional Himalayan yak ghee made from yak milk sourced from high-altitude Himalayan pastures.",
      variants: [
        {
          label: "250ml",
          sku: "HYG-YAK-250",
          price: 2462,
          qty: 250,
          unit: "ml",
          isDefault: false,
        },
        {
          label: "500ml",
          sku: "HYG-YAK-500",
          price: 4925,
          qty: 500,
          unit: "ml",
          isDefault: true,
        },
        {
          label: "1000ml",
          sku: "HYG-YAK-1000",
          price: 9850,
          qty: 1000,
          unit: "ml",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Vedic Ghee",
      slug: "himalayan-vedic-ghee",
      brand: "Himalayan",
      category: "Ghee",
      origin: "Kullu Valley, Himachal Pradesh",
      altitude: "2,460 m",
      region: "Kullu Valley, Himachal Pradesh",
      shortDescription:
        "Traditional Himalayan ghee made from indigenous Himalayan cow milk using the Bilona-style method.",
      variants: [
        {
          label: "250ml",
          sku: "HVG-250",
          price: 925,
          qty: 250,
          unit: "ml",
          isDefault: false,
        },
        {
          label: "500ml",
          sku: "HVG-500",
          price: 1850,
          qty: 500,
          unit: "ml",
          isDefault: true,
        },
        {
          label: "1000ml",
          sku: "HVG-1000",
          price: 3700,
          qty: 1000,
          unit: "ml",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Wild Forest Honey",
      slug: "himalayan-wild-forest-honey",
      brand: "Himalayan",
      category: "Honey",
      origin: "Kullu Valley, Himachal Pradesh",
      altitude: "2,200–2,400 m",
      region: "Kullu Valley, Himachal Pradesh",
      shortDescription:
        "Wild forest honey gathered from diverse forests, wildflowers and mountain meadows of Kullu.",
      variants: [
        {
          label: "250g",
          sku: "HWFH-250",
          price: 480,
          qty: 250,
          unit: "g",
          isDefault: false,
        },
        {
          label: "500g",
          sku: "HWFH-500",
          price: 960,
          qty: 500,
          unit: "g",
          isDefault: true,
        },
        {
          label: "1kg",
          sku: "HWFH-1000",
          price: 1920,
          qty: 1000,
          unit: "g",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Thyme Honey",
      slug: "himalayan-thyme-honey",
      brand: "Himalayan",
      category: "Honey",
      origin: "Lahaul & Spiti, Himachal Pradesh",
      altitude: "~3,200 m",
      region: "Lahaul & Spiti, Himachal Pradesh",
      shortDescription:
        "Rare Himalayan thyme honey with an aromatic, herbal and naturally floral character.",
      variants: [
        {
          label: "250g",
          sku: "HTH-250",
          price: 620,
          qty: 250,
          unit: "g",
          isDefault: false,
        },
        {
          label: "500g",
          sku: "HTH-500",
          price: 1240,
          qty: 500,
          unit: "g",
          isDefault: true,
        },
        {
          label: "1kg",
          sku: "HTH-1000",
          price: 2480,
          qty: 1000,
          unit: "g",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Winter White Honey",
      slug: "himalayan-winter-white-honey",
      brand: "Himalayan",
      category: "Honey",
      origin: "Kullu Valley, Himachal Pradesh",
      altitude: "~2,200 m",
      region: "Kullu Valley, Himachal Pradesh",
      shortDescription:
        "Naturally pale Himalayan honey with a soft, creamy character and delicate floral notes.",
      variants: [
        {
          label: "500g",
          sku: "HWW-500",
          price: 1400,
          qty: 500,
          unit: "g",
          isDefault: true,
        },
        {
          label: "1kg",
          sku: "HWW-1000",
          price: 2800,
          qty: 1000,
          unit: "g",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Chestnut Honey",
      slug: "himalayan-chestnut-honey",
      brand: "Himalayan",
      category: "Honey",
      origin: "Kullu Valley, Himachal Pradesh",
      altitude: "~2,200 m",
      region: "Kullu Valley, Himachal Pradesh",
      shortDescription:
        "Dark, expressive honey from Himalayan chestnut landscapes with deep woody and aromatic notes.",
      variants: [
        {
          label: "250g",
          sku: "HCH-250",
          price: 480,
          qty: 250,
          unit: "g",
          isDefault: false,
        },
        {
          label: "500g",
          sku: "HCH-500",
          price: 960,
          qty: 500,
          unit: "g",
          isDefault: true,
        },
        {
          label: "1kg",
          sku: "HCH-1000",
          price: 1920,
          qty: 1000,
          unit: "g",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Honeydew Honey",
      slug: "himalayan-honeydew-honey",
      brand: "Himalayan",
      category: "Honey",
      origin: "Lahaul & Spiti, Himachal Pradesh",
      altitude: "High altitude",
      region: "High-altitude Himalayan villages",
      shortDescription:
        "A distinctive honey made from honeydew rather than flower nectar, with a deep earthy character.",
      variants: [
        {
          label: "250g",
          sku: "HDH-250",
          price: 620,
          qty: 250,
          unit: "g",
          isDefault: false,
        },
        {
          label: "500g",
          sku: "HDH-500",
          price: 1240,
          qty: 500,
          unit: "g",
          isDefault: true,
        },
        {
          label: "1kg",
          sku: "HDH-1000",
          price: 2480,
          qty: 1000,
          unit: "g",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Sea Buckthorn Pulp",
      slug: "himalayan-sea-buckthorn-pulp",
      brand: "Himalayan",
      category: "Pulp",
      origin: "Nubra Valley, Ladakh",
      altitude: "~3,000 m",
      region: "Nubra Valley, Ladakh",
      shortDescription:
        "Vibrant sea buckthorn pulp from the high Trans-Himalayan landscape of Nubra Valley.",
      variants: [
        {
          label: "250ml",
          sku: "HSBP-250",
          price: 700,
          qty: 250,
          unit: "ml",
          isDefault: false,
        },
        {
          label: "500ml",
          sku: "HSBP-500",
          price: 1400,
          qty: 500,
          unit: "ml",
          isDefault: true,
        },
        {
          label: "1000ml",
          sku: "HSBP-1000",
          price: 2800,
          qty: 1000,
          unit: "ml",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Ladakhi Shilajit",
      slug: "himalayan-ladakhi-shilajit",
      brand: "Himalayan",
      category: "Shilajit",
      origin: "Ladakh",
      altitude: "High-altitude mountain regions",
      region: "Ladakh",
      shortDescription:
        "Purified shilajit resin sourced from the high-altitude mountain regions of Ladakh.",
      variants: [
        {
          label: "10g",
          sku: "HLS-10",
          price: 640,
          qty: 10,
          unit: "g",
          isDefault: false,
        },
        {
          label: "20g",
          sku: "HLS-20",
          price: 1280,
          qty: 20,
          unit: "g",
          isDefault: true,
        },
        {
          label: "40g",
          sku: "HLS-40",
          price: 2560,
          qty: 40,
          unit: "g",
          isDefault: false,
        },
        {
          label: "50g",
          sku: "HLS-50",
          price: 3200,
          qty: 50,
          unit: "g",
          isDefault: false,
        },
      ],
    },
    {
      name: "Himalayan Coffee",
      slug: "himalayan-coffee",
      brand: "Himalayan",
      category: "Coffee",
      origin: "Himalayan region",
      altitude: "—",
      region: "Himalayas",
      shortDescription:
        "Himalayan coffee available as roasted whole beans, offering a distinctive mountain-grown coffee experience.",
      variants: [
        {
          label: "250g",
          sku: "HC-250",
          price: 1680,
          qty: 250,
          unit: "g",
          isDefault: true,
        },
        {
          label: "500g",
          sku: "HC-500",
          price: 3260,
          qty: 500,
          unit: "g",
          isDefault: false,
        },
      ],
    },
  ];

  const location =
    (await prisma.inventoryLocation.findFirst({
      where: { isActive: true },
    })) ??
    (await prisma.inventoryLocation.create({
      data: {
        name: "Main Warehouse",
        type: "warehouse",
        isActive: true,
      },
    }));

  for (const product of products) {
    console.log(`Adding ${product.name}...`);

    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      console.log(`  Skipping ${product.name} — already exists`);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        shortDescription: product.shortDescription,
        status: "ACTIVE",
        currency: "INR",
        featured: false,
      },
    });

    await prisma.productPassport.create({
      data: {
        productId: created.id,
        altitude: product.altitude,
        region: product.region,
      },
    });

    for (const variant of product.variants) {
      const createdVariant = await prisma.productVariant.create({
        data: {
          productId: created.id,
          name: variant.label,
          sku: variant.sku,
          sellingPrice: variant.price,
          mrp: variant.price,
          netQuantity: variant.qty,
          unit: variant.unit,
          isDefault: variant.isDefault,
          status: "ACTIVE",
        },
      });

      await prisma.inventoryItem.create({
        data: {
          productVariantId: createdVariant.id,
          inventoryLocationId: location.id,
          quantityOnHand: 50,
          quantityReserved: 0,
          status: "ACTIVE",
        },
      });
    }

    console.log(
      `  ✓ ${product.name} added with ${product.variants.length} variants`,
    );
  }

  console.log("Done! All products seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
