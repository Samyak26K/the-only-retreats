import { prisma } from "../lib/prisma";

const imageMap: Record<string, string[]> = {
  "himalayan-vedic-ghee": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788072007/Vedic_Himalayan_Ghee_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787979710/VedicHimalayanGheeHero.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787979712/VedicHimalayanGhee-The_Spoon_Pour.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787979786/Vedic_Himalayan_Ghee_Flat_Lay.png",
  ],
  "himalayan-vedic-yak-ghee": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788072007/Vedic_Himalayan_Ghee_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787979710/VedicHimalayanGheeHero.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787979712/VedicHimalayanGhee-The_Spoon_Pour.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787979786/Vedic_Himalayan_Ghee_Flat_Lay.png",
  ],
  "himalayan-wild-forest-honey": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073391/Himalayan_Forest_Honey_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787980461/Himalayan_Forest_Honey-1st_image.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787980461/Himalayan_Forest_Honey_-_2nd_image.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787980461/Himalayan_Forest_Honey_-_3rd_image.png",
  ],
  "himalayan-coffee": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073391/Himalayan_Coffee_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787981589/Himalayan_Coffee.png",
  ],
  "himalayan-thyme-honey": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073393/Spiti_Valley_Thyme_Honey_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787981590/Spiti_Valley_Thyme_Honey_single_only.png",
  ],
  "himalayan-honeydew-honey": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073391/Himalayan_HoneyDew_Honey_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787982355/Himalayan_Honeydew_Honey.png",
  ],
  "himalayan-winter-white-honey": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073810/Himalayan_Winter_White_Honey_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787982355/Himalayan_White_Honey.png",
  ],
  "himalayan-ladakhi-shilajit": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073392/Himalayan_Ladakhi_Shilajit_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787982355/Himalayan_Ladakhi_Shilajit.png",
  ],
  "himalayan-sea-buckthorn-pulp": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073810/Himalayan_Sea_Buckthorn_Pulp_final_first.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787982900/Himalayan_Sea_Buckthorn.png",
  ],
  "himalayan-chestnut-honey": [
    "https://res.cloudinary.com/k7cipxug/image/upload/v1788073953/Himalayan_Chestnut_honey_Final_First.png",
    "https://res.cloudinary.com/k7cipxug/image/upload/v1787983134/Himalayan_Chestnut_Honey.png",
  ],
};

async function main() {
  console.log("Seeding product images...");

  for (const [slug, images] of Object.entries(imageMap)) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!product) {
      console.log(`  Skipping ${slug} — not found`);
      continue;
    }

    // Delete existing media
    await prisma.productMedia.deleteMany({
      where: { productId: product.id },
    });

    // Add new images
    await prisma.productMedia.createMany({
      data: images.map((url, index) => ({
        productId: product.id,
        type: "image",
        url,
        alt: product.name,
        sortOrder: index,
      })),
    });

    console.log(`  ✓ ${product.name} — ${images.length} image(s)`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
