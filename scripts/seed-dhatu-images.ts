import { prisma } from "../lib/prisma";

const productImages: Record<string, string> = {
  "copper-water-dispenser":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840546/Copper_Water_Dispenser.png",
  "copper-glass":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840552/Copper_Glass.png",
  "copper-water-bottle":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840555/Copper_Water_Bottle.png",
  "kansa-dinner-thaali-set":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840597/Kansa_Dinner_Thaali_Plate_Set.png",
  "brass-thaali-set-30-pieces":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840696/Brass_Thaali_Set_30_Pieces_Dinner_Set.png",
  "brass-patili-non-stick":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840788/Brass_Patili_Degchi_Naturally_Non-Stick.png",
  "brass-dosa-tawa":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840973/Brass_Dosa_Tawa_with_Insulated_Handle.png",
  "brass-roti-tawa":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787840973/Brass_Dosa_Tawa_with_Insulated_Handle.png",
  "brass-patila-milk-topia":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787841094/Brass_Patila_Milk_Topia_Naturally_Non-Stick.png",
  "patila-tawa-ladles-set":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787841619/Patila_Tawa_Ladles_Set.png",
  "grand-rasoi-set":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787841767/The_Grand_Rasoi_Set.png",
  "copper-legacy-set":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787841873/Copper_Legacy_Set.png",
  "complete-copper-kitchen-set":
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787841948/Complete_Copper_Kitchen_Set.png",
};

async function main() {
  console.log("Seeding Dhatu product images...");

  for (const [slug, imageUrl] of Object.entries(productImages)) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!product) {
      console.log(`  Skipping ${slug} — product not found`);
      continue;
    }

    await prisma.productMedia.deleteMany({
      where: { productId: product.id },
    });

    await prisma.productMedia.create({
      data: {
        productId: product.id,
        type: "image",
        url: imageUrl,
        alt: product.name,
        sortOrder: 0,
      },
    });

    console.log(`  ✓ Image added for ${product.name}`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
