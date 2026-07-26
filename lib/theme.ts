export const fontVariables = {
  display: "--font-display-family",
  heading: "--font-heading-family",
  body: "--font-body-family",
  sanskrit: "--font-sanskrit-family",
} as const;

export const colors = {
  background: "#F8F7F2",
  surface: "#ECE7DB",
  border: "#CFC5B3",
  muted: "#7E766B",
  text: "#262521",
  forest: "#304238",
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
  large: "1rem",
  extraLarge: "1.5rem",
} as const;

export const shadows = {
  subtleSm: "0 1px 2px rgba(38, 37, 33, 0.04)",
  subtleMd: "0 8px 24px rgba(38, 37, 33, 0.06)",
  subtleLg: "0 16px 40px rgba(38, 37, 33, 0.08)",
} as const;

export const transitions = {
  fast: "120ms ease-out",
  normal: "180ms ease-out",
  slow: "260ms ease-out",
} as const;

export const container = {
  maxWidth: "1280px",
  padding: "clamp(1rem, 2.5vw, 2rem)",
} as const;
