import { prisma } from "../lib/prisma";

const productContent = [
  {
    slug: "havan-kit",
    name: "Havan Kit",
    shortDescription:
      "Everything needed for a complete daily havan — the sacred fire ritual that has centred Indian homes for thousands of years. Thoughtfully assembled, traditionally sourced, nothing synthetic.",
    longDescription:
      "The havan is not a ceremony reserved for occasions — it is a daily practice of clearing, grounding and gratitude. This kit contains everything needed to perform a proper havan at home: compact Nano Havan cups, a measured quantity of pure Havan Samagri, and fine Havan Powder for oblations. Each element is sourced and composed without synthetic additives or artificial fragrance. Light the cup, offer the samagri, and let the fire do what it has always done.",
  },
  {
    slug: "de-tan-soap",
    name: "De-Tan Soap",
    shortDescription:
      "A deep-cleansing bar of activated charcoal, coffee and rose — made for skin that carries the weight of sun, dust and the day. Draws out, buffs away, then calms.",
    longDescription:
      "The De-Tan Soap works on a simple, time-tested principle: charcoal draws, coffee buffs, rose soothes. Activated charcoal pulls impurities and excess sebum from deep within the pores. Coffee grounds provide a gentle physical exfoliation that lifts dead and tanned skin cells while improving surface circulation. Rose water and petal extracts cool and calm whatever the charcoal and coffee stir up. Free from sulphates, parabens and synthetic fragrance.",
  },
  {
    slug: "ubtan-soap",
    name: "Ubtan Soap",
    shortDescription:
      "The ancestral brightening ritual — turmeric, mustard, rice flour and gram — pressed into a daily bar. What your grandmother mixed in a bowl, unchanged in everything that matters.",
    longDescription:
      "Ubtan predates every skincare brand in existence. The combination of turmeric, mustard, rice flour and gram flour was used across Indian households for generations. This soap preserves that formula without compromise. Turmeric brings its well-documented anti-inflammatory and skin-evening properties. Mustard nourishes and warms the skin. Rice flour exfoliates gently. Gram flour cleanses without stripping the skin's natural oils. Free from synthetic brighteners, bleaching agents and artificial fragrance.",
  },
  {
    slug: "dhoop-batti",
    name: "Dhoop Batti",
    shortDescription:
      "Incense sticks made from cow dung, natural herbs and Vedic resins. The way they were made before synthetic fragrance existed — slow-burning, clean, genuinely aromatic.",
    longDescription:
      "Most incense sticks are built around a bamboo core dipped in synthetic fragrance oil. These are not. Divya Dhoop Batti use a base of dried and processed cow dung — considered purifying in Vedic tradition — combined with a blend of natural resins, dried herbs and aromatic botanicals. There is no synthetic fragrance, no charcoal filler, no artificial binder. Suitable for daily puja, evening meditation, or simply clearing the air of a room at the end of the day.",
  },
  {
    slug: "guggal-sambrani-cup",
    name: "Guggal Sambrani Cup – Pack of 4",
    shortDescription:
      "Guggal resin — one of the oldest purifying agents in Ayurveda — pressed into a terracotta cup and ready to burn. Deep, grounding, sacred.",
    longDescription:
      "Guggal has been used in Indian ritual and medicine for over three thousand years — prized for its deeply grounding fragrance and its well-documented antimicrobial and space-purifying properties. These handcrafted terracotta cups contain pure guggal resin in a self-contained form — no charcoal disc, no brass holder, no preparation required. Simply light the top of the cup and allow it to smoulder. Each cup burns for approximately 15-20 minutes. Pack of 4.",
  },
  {
    slug: "chandan-sambrani-cup",
    name: "Chandan Sambrani Cup – Pack of 4",
    shortDescription:
      "Sandalwood chips and natural resin in a terracotta cup — the cool, contemplative fragrance of the temple, available at your home altar every morning.",
    longDescription:
      "Sandalwood is among the most revered aromatic materials in Indian tradition — used in temples, burned during meditation for its cooling, calming and focusing properties. The Chandan Sambrani Cup contains a blend of real sandalwood chips and natural botanical resin, pressed into a handcrafted terracotta cup. Particularly suited to morning prayer, seated meditation, or the simple practice of sitting still for a few minutes. Each cup burns for approximately 15-20 minutes. Pack of 4.",
  },
  {
    slug: "gulab-sambrani-cup",
    name: "Gulab Sambrani Cup – Pack of 4",
    shortDescription:
      "Rose petals and natural resin in a terracotta cup — soft, devotional fragrance for evening prayer, for offering, for the quiet end of a day.",
    longDescription:
      "Rose has a long and specific history in Indian worship — offered at shrines, scattered at thresholds, distilled into the attar that perfumed royal spaces. The Gulab Sambrani Cup brings that association into a slow-burning terracotta cup: rose petals combined with natural resin, pressed and dried, requiring no preparation. Particularly well-suited to evening puja or any ritual that calls for a gentle, warm fragrance at the close of the day. Each cup burns for approximately 15-20 minutes. Pack of 4.",
  },
];

async function main() {
  console.log("Updating Divya product content...");

  for (const content of productContent) {
    const product = await prisma.product.findUnique({
      where: { slug: content.slug },
    });

    if (!product) {
      console.log(`  Skipping ${content.slug} — not found`);
      continue;
    }

    await prisma.product.update({
      where: { slug: content.slug },
      data: {
        name: content.name,
        shortDescription: content.shortDescription,
        longDescription: content.longDescription,
      },
    });

    console.log(`  ✓ Updated ${content.name}`);
  }

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
