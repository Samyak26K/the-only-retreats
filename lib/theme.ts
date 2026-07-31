export const fontVariables = {
  display: "--font-display-family",
  heading: "--font-heading-family",
  body: "--font-body-family",
  sanskrit: "--font-sanskrit-family",
} as const;

export const colors = {
  background: "#F7F5F1",
  surface: "#FFFFFF",
  cloud: "#E6EDF3",
  border: "#D9D7D3",
  muted: "#5F6670",
  text: "#2B2B2B",
  forest: "#2F3A2A",
  gold: "#B8A080",
  success: "#557A46",
  destructive: "#B86A5D",
  moss: "#5F7154",
  copper: "#A46F42",
  honey: "#C48A2E",
  butter: "#D8BE6A",
  earth: "#4A3728",
} as const;

export const spacing = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "2.5rem",
  "2xl": "3rem",
  "3xl": "4rem",
} as const;

export const radius = {
  small: "0.375rem",
  medium: "0.75rem",
  /** Buttons */
  large: "1rem",
  /** Cards */
  extraLarge: "1.5rem",
  /** Panels & Images */
  panel: "1.75rem",
  /** Bottom Sheets & Drawers */
  sheet: "2rem",
} as const;

export const shadows = {
  subtleSm: "0 1px 2px rgba(38, 37, 33, 0.04)",
  subtleMd: "0 8px 24px rgba(38, 37, 33, 0.06)",
  subtleLg: "0 16px 40px rgba(38, 37, 33, 0.08)",
} as const;

export const transitions = {
  fast: "150ms",
  normal: "300ms",
  slow: "600ms",
  hero: "1200ms",
} as const;

export const container = {
  maxWidth: "1280px",
  padding: {
    mobile: "1.5rem",
    tablet: "3rem",
    desktop: "5rem",
  },
} as const;

export const navbarHeight = {
  mobile: "4.5rem",
  tablet: "5rem",
  desktop: "5.5rem",
} as const;
