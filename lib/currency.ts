"use client";

export const SUPPORTED_CURRENCIES = {
  INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
  AED: { symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
  SGD: { symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  CAD: { symbol: "CA$", name: "Canadian Dollar", locale: "en-CA" },
  AUD: { symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
};

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

export function formatPrice(
  amountINR: number,
  currency: CurrencyCode,
  rate: number,
): string {
  const converted = currency === "INR" ? amountINR : amountINR * rate;
  const { locale } = SUPPORTED_CURRENCIES[currency];

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "INR" ? 0 : 2,
  }).format(converted);
}
