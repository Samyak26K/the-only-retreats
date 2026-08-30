"use client";

import { useCurrencyStore } from "@/lib/currency-store";
import { formatPrice } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";

export function useCurrencyPrice() {
  const { currency, rate } = useCurrencyStore();

  return {
    currency,
    formatAmount: (amountINR: number) =>
      formatPrice(amountINR, currency as CurrencyCode, rate),
  };
}
