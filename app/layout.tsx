import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Literata,
  Manrope,
  Tiro_Devanagari_Sanskrit,
} from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";
import { CartToast } from "@/components/shared/CartToast";
import { PageLoader } from "@/components/shared/PageLoader";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { warmupDb } from "@/lib/db-warmup";
import { AppProviders } from "@/providers/app-providers";

import "@/styles/globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const headingFont = Literata({
  variable: "--font-heading-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sanskritFont = Tiro_Devanagari_Sanskrit({
  variable: "--font-sanskrit-family",
  subsets: ["devanagari"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theonlyretreats.com"),
  title: {
    default: "The Only Retreats | Himalayan Origins, Heritage & Nourishment",
    template: `%s | The Only Retreats`,
  },
  description:
    "Authentic Himalayan nourishment — raw honey, Bilona ghee, Shilajit and heritage foods sourced directly from high-altitude valleys. Not mass produced. Only preserved.",
  keywords: [
    "Himalayan honey",
    "Bilona ghee",
    "Himalayan products",
    "heritage foods India",
    "The Only Retreats",
    "raw honey India",
    "Ladakhi Shilajit",
  ],
  openGraph: {
    title: "The Only Retreats | Himalayan Origins, Heritage & Nourishment",
    description:
      "Authentic Himalayan nourishment sourced directly from high-altitude valleys. Not mass produced. Only preserved.",
    url: "https://theonlyretreats.com",
    siteName: "The Only Retreats",
    type: "website",
    images: [
      {
        url: "/images/og/og-homepage.webp",
        width: 1200,
        height: 630,
        alt: "The Only Retreats — Ancient Himalayan Nourishment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Only Retreats | Himalayan Origins, Heritage & Nourishment",
    description:
      "Authentic Himalayan nourishment. Not mass produced. Only preserved.",
    images: ["/images/og/og-homepage.webp"],
  },
  alternates: {
    canonical: "https://theonlyretreats.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ADD_YOUR_GOOGLE_VERIFICATION_CODE_HERE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  warmupDb();

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${headingFont.variable} ${bodyFont.variable} ${sanskritFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ScrollToTop />
        <PageLoader />
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-foreground focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Skip to content
        </a>
        <AppProviders>
          <SmoothScroll />
          <AppShell>{children}</AppShell>
        </AppProviders>
        <CartToast />
      </body>
    </html>
  );
}
