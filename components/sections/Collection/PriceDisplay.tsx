"use client";

import { useCurrencyStore } from "@/lib/currency-store";
import { formatPrice } from "@/lib/currency";
import type { CurrencyCode } from "@/lib/currency";

type Props = {
  priceINR: number;
};

export function PriceDisplay({ priceINR }: Props) {
  const { currency, rate } = useCurrencyStore();

  return (
    <p className="font-heading text-base text-gold">
      {formatPrice(priceINR, currency as CurrencyCode, rate)}
    </p>
  );
}
