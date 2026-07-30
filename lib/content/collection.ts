export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  origin: string;
  featured?: boolean;
  tagline?: string;
  editorialDescription?: string;
}

export interface CollectionProduct {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cta: string;
  href: string;
  image: string;
}

export const collectionSection: CollectionSectionContent = {
  title: "Featured Collection",
  subtitle:
    "A single focused introduction to the collection, presented as an editorial feature rather than a product grid.",
};

export const collectionProducts: CollectionProduct[] = [
  {
    id: "yak-ghee-premium",
    name: "Yak Ghee — Premium",
    tagline: "Pure, clarified yak butter from high altitude herds.",
    description:
      "Our signature ghee is slow-made in the mountains and carries the depth of high-altitude pasture, hand-churned tradition, and careful sourcing.",
    cta: "Explore Product",
    href: "#contact",
    image: "/images/product-yak-ghee.jpg",
    origin: "Spiti Valley, Himachal Pradesh",
    featured: true,
    tagline: "The Flagship",
    editorialDescription:
      "Clarified over wood fire at 12,000 feet. This ghee carries the essence of Spiti—cold mountain air, sparse grasslands, and centuries of herding wisdom. Each jar is a testament to patience, purity, and the relationship between land, animal, and caretaker.",
  },
  {
    id: "raw-honey",
    name: "Raw Himalayan Honey",
    tagline: "Unfiltered, unpasteurized wildflower honey.",
    description:
      "Harvested in small batches, this honey preserves the character of alpine blooms and the natural variations of the valley seasons.",
    cta: "Explore Product",
    href: "#contact",
    image: "/images/product-honey.jpg",
  },
  {
    id: "yak-butter",
    name: "Yak Butter — Unsalted",
    tagline: "Rich, grassy butter for cooking and traditional tea.",
    description:
      "A versatile mountain staple with a clean finish, crafted to support both traditional preparations and contemporary kitchens.",
    cta: "Explore Product",
    href: "#contact",
    image: "/images/product-yak-butter.jpg",
  },
  {
    id: "ghee-infused-spices",
    name: "Ghee & Spice Blend",
    tagline: "Clarified yak ghee infused with Himalayan warming spices.",
    description:
      "A more layered interpretation of the house staple, bringing warmth and aroma to everyday cooking.",
    cta: "Explore Product",
    href: "#contact",
    image: "/images/product-spice-ghee.jpg",
  },
];

export function getFeaturedProduct(): Product | undefined {
  return collectionContent.find((product) => product.featured);
}
