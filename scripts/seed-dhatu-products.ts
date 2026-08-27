import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding Dhatu products...");

  const products = [
    {
      name: "Copper Water Dispenser",
      slug: "copper-water-dispenser",
      brand: "Dhatu",
      category: "Copper",
      shortDescription:
        "Elegant copper water dispenser designed for traditional and healthy water storage and serving.",
      price: 9099,
    },
    {
      name: "Copper Glass",
      slug: "copper-glass",
      brand: "Dhatu",
      category: "Copper",
      shortDescription:
        "Handcrafted copper drinking glass, ideal for everyday use and traditional copper-water storage.",
      price: 2272,
    },
    {
      name: "Copper Water Bottle",
      slug: "copper-water-bottle",
      brand: "Dhatu",
      category: "Copper",
      shortDescription:
        "Premium copper water bottle designed for convenient everyday hydration with a traditional touch.",
      price: 2489,
    },
    {
      name: 'Kansa Dinner Thaali Set 10.5"',
      slug: "kansa-dinner-thaali-set",
      brand: "Dhatu",
      category: "Kansa",
      shortDescription:
        "Premium handcrafted Kansa dinner set featuring traditional dining pieces, perfect for elegant everyday meals and special occasions.",
      price: 44700,
    },
    {
      name: "Brass Thaali Set – 30 Pieces Dinner Set",
      slug: "brass-thaali-set-30-pieces",
      brand: "Dhatu",
      category: "Brass",
      shortDescription:
        "Complete handcrafted brass dinner set with multiple traditional dining pieces for serving authentic Indian meals.",
      price: 23236,
    },
    {
      name: "Brass Patili – Naturally Non-Stick",
      slug: "brass-patili-non-stick",
      brand: "Dhatu",
      category: "Brass",
      shortDescription:
        "Traditional brass cooking pot designed for everyday cooking with a naturally non-stick cooking surface.",
      price: 4299,
    },
    {
      name: "Brass Roti Tawa with Insulated Handle",
      slug: "brass-roti-tawa",
      brand: "Dhatu",
      category: "Brass",
      shortDescription:
        "Handcrafted brass tawa with an insulated handle, ideal for making rotis and traditional Indian flatbreads.",
      price: 4489,
    },
    {
      name: "Brass Dosa Tawa with Insulated Handle",
      slug: "brass-dosa-tawa",
      brand: "Dhatu",
      category: "Brass",
      shortDescription:
        "Wide handcrafted brass dosa tawa with an insulated handle, designed for making crispy dosas and other flatbreads.",
      price: 4899,
    },
    {
      name: "Brass Patila – Milk Topia",
      slug: "brass-patila-milk-topia",
      brand: "Dhatu",
      category: "Brass",
      shortDescription:
        "Traditional brass cooking vessel suitable for preparing milk and everyday dishes with a naturally non-stick surface.",
      price: 3854,
    },
    {
      name: "Patila, Tawa & Ladles Set",
      slug: "patila-tawa-ladles-set",
      brand: "Dhatu",
      category: "Brass",
      shortDescription:
        "Complete traditional brass kitchen set combining a patila, tawa and essential ladles for everyday Indian cooking.",
      price: 11589,
    },
    {
      name: "The Grand Rasoi Set",
      slug: "grand-rasoi-set",
      brand: "Dhatu",
      category: "Brass",
      shortDescription:
        "Premium handcrafted kitchen collection featuring traditional cookware and serving utensils for a complete Indian kitchen setup.",
      price: 16499,
    },
    {
      name: "Copper Legacy Set",
      slug: "copper-legacy-set",
      brand: "Dhatu",
      category: "Copper",
      shortDescription:
        "Premium collection of handcrafted copper cookware designed to bring traditional Indian craftsmanship into the modern kitchen.",
      price: 23199,
    },
    {
      name: "Complete Copper Kitchen Set",
      slug: "complete-copper-kitchen-set",
      brand: "Dhatu",
      category: "Copper",
      shortDescription:
        "Extensive handcrafted copper cookware collection containing essential vessels for a complete traditional kitchen.",
      price: 50829,
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
      console.log(`  Skipping — already exists`);
      continue;
    }

    const category = await prisma.category.upsert({
      where: { slug: product.category.toLowerCase() },
      update: {},
      create: {
        name: product.category,
        slug: product.category.toLowerCase(),
      },
    });

    const created = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        shortDescription: product.shortDescription,
        status: "ACTIVE",
        currency: "INR",
        featured: false,
        categoryId: category.id,
        mrp: product.price,
        sellingPrice: product.price,
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: created.id,
        name: "Standard",
        sku: `DHT-${product.slug.toUpperCase().replace(/-/g, "").slice(0, 20)}`,
        sellingPrice: product.price,
        mrp: product.price,
        isDefault: true,
        status: "ACTIVE",
      },
    });

    await prisma.inventoryItem.create({
      data: {
        productVariantId: variant.id,
        inventoryLocationId: location.id,
        quantityOnHand: 20,
        quantityReserved: 0,
        status: "ACTIVE",
      },
    });

    console.log(`  ✓ Added with price ₹${product.price}`);
  }

  console.log("Done! All Dhatu products seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
