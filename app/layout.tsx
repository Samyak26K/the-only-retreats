import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Literata,
  Manrope,
  Tiro_Devanagari_Sanskrit,
} from "next/font/google";

import { Header } from "@/components/layout/Header";
import { SITE_NAME } from "@/lib/constants";
import { AppProviders } from "@/providers/app-providers";

import "@/styles/globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const headingFont = Literata({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sanskritFont = Tiro_Devanagari_Sanskrit({
  variable: "--font-sanskrit",
  subsets: ["devanagari"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Premium Himalayan heritage products — authentic yak ghee, raw honey, and carefully sourced goods from the mountains.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${headingFont.variable} ${bodyFont.variable} ${sanskritFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AppProviders>
          <Header />
          <main className="flex-1">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
