import { prisma } from "../lib/prisma";

function categorySlug(category: string) {
  return category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
}

async function main() {
  console.log("Updating Divya products...");

  const cancelledSlugs = [
    "shuddh-gau-ghrit",
    "divya-dhara-roll-on",
    "twacha-herbal-oil",
    "nabhi-tel",
    "shuddh-gomutra",
    "nano-havan",
    "havan-samagri",
    "havan-powder",
    "guggal-sambrani-cup",
    "chandan-sambrani-cup",
    "gulab-sambrani-cup",
    "dhoop-batti",
    "de-tan-soap",
    "ubtan-soap",
  ];

  for (const slug of cancelledSlugs) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (product) {
      await prisma.productPassport.deleteMany({
        where: { productId: product.id },
      });
      await prisma.productContentBlock.deleteMany({
        where: { productId: product.id },
      });
      await prisma.productMedia.deleteMany({
        where: { productId: product.id },
      });
      await prisma.inventoryMovement.deleteMany({
        where: {
          inventoryItem: { productVariant: { productId: product.id } },
        },
      });
      await prisma.inventoryItem.deleteMany({
        where: {
          productVariant: { productId: product.id },
        },
      });
      await prisma.productVariant.deleteMany({
        where: { productId: product.id },
      });
      await prisma.product.delete({ where: { slug } });
      console.log(`  ✓ Removed ${slug}`);
    }
  }

  const location =
    (await prisma.inventoryLocation.findFirst({
      where: { isActive: true },
    })) ??
    (await prisma.inventoryLocation.create({
      data: { name: "Main Warehouse", type: "warehouse", isActive: true },
    }));

  const activeProducts = [
    {
      name: "Havan Kit",
      slug: "havan-kit",
      shortDescription:
        "Convenient havan kit for easy daily havan and puja rituals.",
      price: 750,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787842575/Nano_Havan.png",
      category: "Ritual & Puja",
    },
    {
      name: "De-Tan Soap",
      slug: "de-tan-soap",
      shortDescription:
        "Ayurvedic charcoal and herbal soap for cleansing, removing dead skin and supporting natural skin glow.",
      price: 149,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843087/De-Tan_Soap.png",
      category: "Ayurvedic Skincare",
    },
    {
      name: "Ubtan Soap",
      slug: "ubtan-soap",
      shortDescription:
        "Natural Ayurvedic ubtan soap for gentle cleansing, nourishment and natural glow.",
      price: 149,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843180/Ubtan_Soap.png",
      category: "Ayurvedic Skincare",
    },
    {
      name: "Dhoop Batti",
      slug: "dhoop-batti",
      shortDescription:
        "Natural cow-dung-based incense sticks suitable for puja, meditation and creating a pleasant fragrance.",
      price: 251,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843744/Dhoop_Batti.png",
      category: "Dhoop & Aromatherapy",
    },
    {
      name: "Guggal Sambrani Cup – Pack of 4",
      slug: "guggal-sambrani-cup",
      shortDescription:
        "Handcrafted Guggal sambrani cups with natural aromatic ingredients for puja and meditation.",
      price: 251,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843893/Guggal_Sambrani_Cup.png",
      category: "Dhoop & Aromatherapy",
    },
    {
      name: "Chandan Sambrani Cup – Pack of 4",
      slug: "chandan-sambrani-cup",
      shortDescription:
        "Handcrafted Chandan sambrani cups with a traditional sandalwood fragrance.",
      price: 251,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787844255/Chnadan_samagri_cup.png",
      category: "Dhoop & Aromatherapy",
    },
    {
      name: "Gulab Sambrani Cup – Pack of 4",
      slug: "gulab-sambrani-cup",
      shortDescription:
        "Handcrafted Gulab sambrani cups with a pleasant rose fragrance for puja and meditation.",
      price: 251,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787844308/Gulab_Sambrani_Cup.png",
      category: "Dhoop & Aromatherapy",
    },
  ];

  for (const product of activeProducts) {
    const existing = await prisma.product.findUnique({
      where: { slug: product.slug },
    });

    if (existing) {
      console.log(`  Skipping ${product.name} — already exists`);
      continue;
    }

    const category = await prisma.category.upsert({
      where: { slug: categorySlug(product.category) },
      update: {},
      create: {
        name: product.category,
        slug: categorySlug(product.category),
      },
    });

    const created = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        brand: "Divya",
        shortDescription: product.shortDescription,
        status: "ACTIVE",
        currency: "INR",
        featured: false,
        categoryId: category.id,
        mrp: product.price,
        sellingPrice: product.price,
      },
    });

    await prisma.productMedia.create({
      data: {
        productId: created.id,
        type: "image",
        url: product.image,
        alt: product.name,
        sortOrder: 0,
      },
    });

    const variant = await prisma.productVariant.create({
      data: {
        productId: created.id,
        name: "Standard",
        sku: `DVY-${product.slug.toUpperCase().replace(/-/g, "").slice(0, 20)}`,
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
        quantityOnHand: 30,
        quantityReserved: 0,
        status: "ACTIVE",
      },
    });

    console.log(`  ✓ Added ${product.name} — ₹${product.price}`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
