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
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { DEFAULT_SITE_URL, SITE_NAME } from "@/lib/constants";
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

const description =
  "Premium Himalayan heritage products — authentic yak ghee, raw honey, and carefully sourced goods from the mountains.";

export const metadata: Metadata = {
  metadataBase: new URL(DEFAULT_SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description,
  openGraph: {
    title: SITE_NAME,
    description,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/images/og/og-homepage.webp",
        width: 1200,
        height: 630,
        alt: "The Only Retreats — Ancient Himalayan Nourishment.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description,
    images: ["/images/og/og-homepage.webp"],
  },
  icons: {
    icon: "/favicon.svg",
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
