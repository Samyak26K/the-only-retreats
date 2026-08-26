export interface NavigationLink {
  label: string;
  href: string;
}

export interface NavigationContent {
  brand: {
    name: string;
    tagline: string;
    href: string;
  };
  primaryLinks: NavigationLink[];
  utility: {
    search: { label: string };
    account: { label: string };
    cart: { label: string };
  };
  menu: {
    openLabel: string;
    closeLabel: string;
    title: string;
  };
}

export const navigationContent: NavigationContent = {
  brand: {
    name: "The Only Retreats",
    tagline: "Not Mass Produced. Only Preserved.",
    href: "/",
  },
  primaryLinks: [
    { label: "Collection", href: "/products" },
    { label: "Origins", href: "/#origins" },
    { label: "Heritage", href: "/#heritage" },
    { label: "Contact", href: "/#contact" },
    { label: "Dhatu", href: "/dhatu" },
  ],
  utility: {
    search: { label: "Search" },
    account: { label: "My Account" },
    cart: { label: "Cart" },
  },
  menu: {
    openLabel: "Open menu",
    closeLabel: "Close menu",
    title: "Menu",
  },
};
