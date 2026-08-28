import { prisma } from "../lib/prisma";

function categorySlug(category: string) {
  return category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
}

async function main() {
  console.log("Seeding Divya products...");

  const products = [
    {
      name: "Nano Havan",
      slug: "nano-havan",
      brand: "Divya",
      category: "Ritual & Puja",
      shortDescription:
        "A convenient, compact havan product designed for easy and safe daily havan at home, office, or while travelling.",
      price: 630,
      status: "ACTIVE" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787842575/Nano_Havan.png",
    },
    {
      name: "Havan Samagri",
      slug: "havan-samagri",
      brand: "Divya",
      category: "Ritual & Puja",
      shortDescription:
        "Traditional Ayurvedic havan mixture made from selected herbs and natural ingredients for puja and havan rituals.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787842937/Havan_Samagri.png",
    },
    {
      name: "Havan Powder",
      slug: "havan-powder",
      brand: "Divya",
      category: "Ritual & Puja",
      shortDescription:
        "A specially prepared herbal powder mixture intended for quick and effective havan rituals.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787842985/Havan_Powder.png",
    },
    {
      name: "De-Tan Soap",
      slug: "de-tan-soap",
      brand: "Divya",
      category: "Ayurvedic Skincare",
      shortDescription:
        "Ayurvedic charcoal and herbal soap designed to reduce tanning, remove dead skin, cleanse and enhance natural glow.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843087/De-Tan_Soap.png",
    },
    {
      name: "Ubtan Soap",
      slug: "ubtan-soap",
      brand: "Divya",
      category: "Ayurvedic Skincare",
      shortDescription:
        "Natural Ayurvedic ubtan soap made with traditional ingredients to cleanse, nourish and promote a natural glow.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843180/Ubtan_Soap.png",
    },
    {
      name: "Shuddh Gau-Ghrit",
      slug: "shuddh-gau-ghrit",
      brand: "Divya",
      category: "Panchagavya Wellness",
      shortDescription:
        "Pure cow ghee intended for religious rituals, traditional practices, and everyday use.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843277/Shuddh_Gau-Ghrit_Cow_Ghee.png",
    },
    {
      name: "Divya Dhara Roll-On",
      slug: "divya-dhara-roll-on",
      brand: "Divya",
      category: "Panchagavya Wellness",
      shortDescription:
        "Herbal roll-on for forehead and nose area. For cold, headache, and blocked nose.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843370/Divya_Dhara_Roll-On.png",
    },
    {
      name: "Twacha Herbal Oil",
      slug: "twacha-herbal-oil",
      brand: "Divya",
      category: "Panchagavya Wellness",
      shortDescription:
        "Special Ayurvedic herbal oil for feet and traditional skin care.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843448/Twacha_Herbal_Oil.png",
    },
    {
      name: "Nabhi Tel",
      slug: "nabhi-tel",
      brand: "Divya",
      category: "Panchagavya Wellness",
      shortDescription:
        "Traditional herbal oil for navel care and supporting overall body balance.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843533/Nabhi_Tel.png",
    },
    {
      name: "Shuddh Gomutra",
      slug: "shuddh-gomutra",
      brand: "Divya",
      category: "Panchagavya Wellness",
      shortDescription:
        "Pure cow urine for traditional Ayurvedic use, health-supporting purposes and religious practices.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843637/Shuddh_Gomutra.png",
    },
    {
      name: "Dhoop Batti",
      slug: "dhoop-batti",
      brand: "Divya",
      category: "Dhoop & Aromatherapy",
      shortDescription:
        "Natural incense sticks made from desi cow dung, for puja, meditation and fragrance.",
      price: 0,
      status: "COMING_SOON" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843744/Dhoop_Batti.png",
    },
    {
      name: "Guggal Sambrani Cup",
      slug: "guggal-sambrani-cup",
      brand: "Divya",
      category: "Dhoop & Aromatherapy",
      shortDescription:
        "Handcrafted sambrani cup with natural aromatic ingredients for puja and meditation.",
      price: 280,
      status: "ACTIVE" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787843893/Guggal_Sambrani_Cup.png",
    },
    {
      name: "Chandan Sambrani Cup",
      slug: "chandan-sambrani-cup",
      brand: "Divya",
      category: "Dhoop & Aromatherapy",
      shortDescription:
        "Handcrafted sambrani cup with sandalwood-based aromatic ingredients for puja and meditation.",
      price: 280,
      status: "ACTIVE" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787844255/Chnadan_samagri_cup.png",
    },
    {
      name: "Gulab Sambrani Cup",
      slug: "gulab-sambrani-cup",
      brand: "Divya",
      category: "Dhoop & Aromatherapy",
      shortDescription:
        "Handcrafted rose-themed sambrani cup with natural aromatic ingredients for puja and meditation.",
      price: 280,
      status: "ACTIVE" as const,
      image:
        "https://res.cloudinary.com/k7cipxug/image/upload/v1787844308/Gulab_Sambrani_Cup.png",
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
        brand: product.brand,
        shortDescription: product.shortDescription,
        status: product.status,
        currency: "INR",
        featured: false,
        categoryId: category.id,
        mrp: product.price > 0 ? product.price : null,
        sellingPrice: product.price > 0 ? product.price : null,
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

    if (product.status === "ACTIVE" && product.price > 0) {
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
    }

    console.log(`  ✓ ${product.name} — ${product.status}`);
  }

  console.log("Done! All Divya products seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
