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
    id: "winter-white-honey",
    name: "Winter White Honey",
    shortDescription:
      "Raw, unheated, unfiltered. Harvested from a single Himalayan flowering season.",
    price: 1200,
    image: "/images/products/winter-white-honey.jpeg",
    origin: "Lahaul Valley, Himachal Pradesh",
    featured: true,
    tagline: "The Flagship",
    editorialDescription:
      "Most honey in the market is blended, heated, and filtered multiple times. This honey is none of those things. Raw, unheated, harvested from a single Himalayan region during one flowering season. Pure, rare, and true to its origin.",
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
