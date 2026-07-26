export interface Valley {
  id: string;
  name: string;
  region: string;
  shortDescription: string;
  longDescription: string;
  featuredProducts: string[];
  image: string;
}

export interface OriginsSectionContent {
  title: string;
  subtitle: string;
}

export const originsSection: OriginsSectionContent = {
  title: "Where It Comes From",
  subtitle:
    "High-altitude valleys where ancient herding traditions meet modern stewardship. Each place shapes the character of what grows there.",
};

export const originsContent: Valley[] = [
  {
    id: "spiti",
    name: "Spiti Valley",
    region: "Himachal Pradesh",
    shortDescription:
      "Cold desert at 12,000 feet. Extreme conditions. Pure yak ghee.",
    longDescription:
      "Spiti Valley sits at one of the highest inhabited places in India. Here, yak herds thrive in sparse grasslands. The cold, thin air creates conditions where dairy products develop unique depth and richness. Our yak ghee from Spiti carries the essence of this unforgiving, beautiful landscape.",
    featuredProducts: ["Yak Ghee Premium"],
    image: "/images/valley-spiti.jpg",
  },
  {
    id: "kinnaur",
    name: "Kinnaur Valley",
    region: "Himachal Pradesh",
    shortDescription: "Apple orchards and apiary. Source of our raw honey.",
    longDescription:
      "Kinnaur Valley is where the rivers flow fast and the apples grow sweet. Wildflower honey gathered here captures the scent of alpine blooms and mountain air. Beekeepers here follow practices unchanged for generations, working with the seasons and the bees.",
    featuredProducts: ["Raw Himalayan Honey"],
    image: "/images/valley-kinnaur.jpg",
  },
  {
    id: "ladakh",
    name: "Ladakh Plateau",
    region: "Ladakh",
    shortDescription:
      "The highest inhabited plateau. Nomadic herding traditions.",
    longDescription:
      "Ladakh is where sky meets earth. Nomadic herders move with their animals across vast, sparse grasslands. The yaks here produce some of India's finest dairy. Our partnerships here honor centuries of pastoral tradition and sustainable grazing practices that have kept these valleys unspoiled.",
    featuredProducts: ["Yak Ghee Premium", "Yak Butter"],
    image: "/images/valley-ladakh.jpg",
  },
];
