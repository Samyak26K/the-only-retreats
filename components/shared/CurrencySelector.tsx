"use client";

import { useEffect, useState } from "react";
import { useCurrencyStore } from "@/lib/currency-store";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    detectUserCurrency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectUserCurrency = async () => {
    try {
      // Detect country from IP
      const geoRes = await fetch("https://ipapi.co/json/");
      const geo = await geoRes.json();

      const countryCurrencyMap: Record<string, CurrencyCode> = {
        US: "USD",
        GB: "GBP",
        AE: "AED",
        SG: "SGD",
        CA: "CAD",
        AU: "AUD",
        DE: "EUR",
        FR: "EUR",
        IT: "EUR",
        ES: "EUR",
        NL: "EUR",
      };

      const detectedCurrency = countryCurrencyMap[geo.country_code] ?? "INR";

      if (detectedCurrency !== "INR") {
        await fetchAndSetRate(detectedCurrency);
      }
    } catch {
      // Default to INR on error
    }
  };

  const fetchAndSetRate = async (targetCurrency: CurrencyCode) => {
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/INR`);
      const data = await res.json();
      const rate = data.rates[targetCurrency] ?? 1;
      setCurrency(targetCurrency, rate);
    } catch {
      setCurrency(targetCurrency, 1);
    }
  };

  const handleSelect = async (code: CurrencyCode) => {
    if (code === "INR") {
      setCurrency("INR", 1);
    } else {
      await fetchAndSetRate(code);
    }
    setOpen(false);
  };

  if (!mounted) return null;

  const current = SUPPORTED_CURRENCIES[currency];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs uppercase 
          tracking-[0.15em] transition-colors"
      >
        <span>{current.symbol}</span>
        <span>{currency}</span>
        <span className="text-[0.5rem]">▾</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-48 
          rounded-xl border border-border bg-background shadow-lg 
          z-50 overflow-hidden"
        >
          {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code as CurrencyCode)}
              className={`w-full flex items-center justify-between 
                px-4 py-2.5 text-xs hover:bg-surface transition-colors
                ${currency === code ? "text-gold" : "text-foreground"}`}
            >
              <span>
                {info.symbol} {code}
              </span>
              <span className="text-muted text-[0.6rem]">{info.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
