/**
 * The single source of truth for valley content used by:
 * - Homepage Valley Cards
 * - Hover Cards
 * - Valley Pages
 * - Valley Product Listings
 * - Future Search
 */

export interface ValleyProductReference {
  slug: string;
  name: string;
}

export interface ValleyShloka {
  sanskrit: string;
  translation: string | null;
  reference: string | null;
}

export interface Valley {
  slug: string;
  name: string;
  editorialTitle: string;
  state: string;
  altitude: string | null;
  coverImage: string | null;
  shortDescription: string | null;
  products: ValleyProductReference[];
  shloka: ValleyShloka;
  brandReflection: string | null;
  order: number;
  isPublished: boolean;
}

export const valleys: Valley[] = [
  {
    slug: "lahaul",
    name: "Lahaul Valley",
    editorialTitle: "The Valley of Wild Nectar",
    state: "Himachal Pradesh",
    altitude: null, // TODO: Add approved altitude.
    coverImage: "/images/valleys/lahaul.webp", // Temporary AI review asset; replace with production photography.
    shortDescription: null, // TODO: Add approved editorial copy.
    products: [
      {
        slug: "thyme-honey",
        name: "Thyme Honey",
      },
      {
        slug: "dew-honey",
        name: "Dew Honey",
      },
    ],
    shloka: {
      sanskrit: "माता भूमिः पुत्रोऽहं पृथिव्याः।",
      translation: null, // TODO: Add approved translation.
      reference: "Atharva Veda 12.1.12",
    },
    brandReflection: null, // TODO: Add approved brand reflection.
    order: 1,
    isPublished: true,
  },
  {
    slug: "kullu",
    name: "Kullu Valley",
    editorialTitle: "The Valley of Sacred Meadows",
    state: "Himachal Pradesh",
    altitude: null, // TODO: Add approved altitude.
    coverImage: "/images/valleys/kullu.webp", // Temporary AI review asset; replace with production photography.
    shortDescription: null, // TODO: Add approved editorial copy.
    products: [
      {
        slug: "cow-ghee",
        name: "Cow Ghee",
      },
      {
        slug: "other-honey",
        name: "Other Honey",
      },
    ],
    shloka: {
      sanskrit: "आहारशुद्धौ सत्त्वशुद्धिः।",
      translation: null, // TODO: Add approved translation.
      reference: "Chandogya Upanishad",
    },
    brandReflection: null, // TODO: Add approved brand reflection.
    order: 2,
    isPublished: true,
  },
  {
    slug: "nubra",
    name: "Nubra Valley",
    editorialTitle: "The Valley of Living Berries",
    state: "Ladakh",
    altitude: null, // TODO: Add approved altitude.
    coverImage: "/images/valleys/nubra.webp", // Temporary AI review asset; replace with production photography.
    shortDescription: null, // TODO: Add approved editorial copy.
    products: [
      {
        slug: "seabuckthorn",
        name: "Seabuckthorn",
      },
    ],
    shloka: {
      sanskrit: "आपो हि ष्ठा मयोभुवाः।",
      translation: null, // TODO: Add approved translation.
      reference: "Rig Veda 10.9",
    },
    brandReflection: null, // TODO: Add approved brand reflection.
    order: 3,
    isPublished: true,
  },
  {
    slug: "zanskar",
    name: "Zanskar Valley",
    editorialTitle: "The Valley Beyond Snow",
    state: "Ladakh",
    altitude: null, // TODO: Add approved altitude.
    coverImage: "/images/valleys/zanskar.webp", // Temporary AI review asset; replace with production photography.
    shortDescription: null, // TODO: Add approved editorial copy.
    products: [
      {
        slug: "yak-ghee",
        name: "Yak Ghee",
      },
    ],
    shloka: {
      sanskrit: "शरीरमाद्यं खलु धर्मसाधनम्।",
      translation: null, // TODO: Add approved translation.
      reference: null, // TODO: Add approved reference.
    },
    brandReflection: null, // TODO: Add approved brand reflection.
    order: 4,
    isPublished: true,
  },
  {
    slug: "changthang",
    name: "Changthang Valley",
    editorialTitle: "The Valley Above the Clouds",
    state: "Ladakh",
    altitude: null, // TODO: Add approved altitude.
    coverImage: "/images/valleys/changthang.webp", // Temporary AI review asset; replace with production photography.
    shortDescription: null, // TODO: Add approved editorial copy.
    products: [
      {
        slug: "shilajit",
        name: "Shilajit",
      },
      {
        slug: "yak-ghee",
        name: "Yak Ghee",
      },
    ],
    shloka: {
      sanskrit: "योगः कर्मसु कौशलम्।",
      translation: null, // TODO: Add approved translation.
      reference: null, // TODO: Add approved reference.
    },
    brandReflection: null, // TODO: Add approved brand reflection.
    order: 5,
    isPublished: true,
  },
];
