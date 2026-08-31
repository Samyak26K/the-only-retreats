export interface FooterContent {
  brand: {
    name: string;
    mission: string;
  };
  explore: {
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
  contact: {
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
  newsletter: {
    title: string;
    description: string;
    buttonText: string;
    placeholder: string;
  };
  bottom: {
    copyright: string;
    madeIn: string;
    closing: string;
  };
}

export const footerContent: FooterContent = {
  brand: {
    name: "The Only Retreats",
    mission: "Not Mass Produced. Only Preserved.",
  },
  explore: {
    title: "Explore",
    links: [
      { label: "Journey", href: "#journey" },
      { label: "Collection", href: "#collection" },
      { label: "Origins", href: "#origins" },
      { label: "Journal", href: "#journal" },
    ],
  },
  contact: {
    title: "Contact",
    links: [
      { label: "Instagram", href: "https://instagram.com/theonlyretreats" },
      { label: "WhatsApp", href: "https://wa.me/919172778248" },
    ],
  },
  newsletter: {
    title: "Newsletter",
    description:
      "Receive stories from the mountains, seasonal updates, and first access to new collections.",
    buttonText: "Join the Journey",
    placeholder: "Your email address",
  },
  bottom: {
    copyright: "© 2024 The Only Retreats. All rights reserved.",
    madeIn: "Made in India",
    closing: "Preserving traditions, one story at a time.",
  },
};
