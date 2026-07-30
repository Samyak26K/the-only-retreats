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

export const collectionContent: Product[] = [
  {
    id: "yak-ghee-premium",
    name: "Yak Ghee — Premium",
    shortDescription: "Pure, clarified yak butter from high altitude herds.",
    price: 1200,
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
    shortDescription:
      "Unfiltered, unpasteurized wildflower honey. Living culture.",
    price: 450,
    image: "/images/product-honey.jpg",
    origin: "Kinnaur Valley, Himachal Pradesh",
  },
  {
    id: "yak-butter",
    name: "Yak Butter — Unsalted",
    shortDescription: "Rich, grassy butter for cooking and traditional tea.",
    price: 680,
    image: "/images/product-yak-butter.jpg",
    origin: "Ladakh Plateau",
  },
  {
    id: "ghee-infused-spices",
    name: "Ghee & Spice Blend",
    shortDescription:
      "Clarified yak ghee infused with Himalayan warming spices.",
    price: 920,
    image: "/images/product-spice-ghee.jpg",
    origin: "Kinnaur & Spiti",
  },
];

export function getFeaturedProduct(): Product | undefined {
  return collectionContent.find((product) => product.featured);
}
