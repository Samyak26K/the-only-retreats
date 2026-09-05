"use client";

import { useEffect, useState } from "react";
import { useCurrencyStore } from "@/lib/currency-store";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

type CurrencySelectorProps = {
  isTransparentHero?: boolean;
};

export function CurrencySelector({
  isTransparentHero = false,
}: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    detectUserCurrency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
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
        className={cn(
          "flex items-center gap-1.5 text-[0.7rem] uppercase",
          "tracking-[0.18em] font-heading font-medium",
          "transition-colors duration-200",
          "hover:opacity-70 focus:outline-none",
          isTransparentHero ? "text-white/90" : "text-foreground/80",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span>{current.symbol}</span>
        <span className="tracking-[0.18em]">{currency}</span>
        <span
          className={cn(
            "text-[0.55rem] opacity-60 transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          ▾
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="absolute left-0 top-full mt-3 z-50
              md:left-auto md:right-0
              w-56 overflow-hidden
              border border-border/60
              bg-background/98 backdrop-blur-sm
              shadow-sm rounded-lg"
          >
            <div className="py-1">
              {Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => {
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(code as CurrencyCode)}
                    className={cn(
                      "w-full flex items-center justify-between",
                      "px-4 py-2.5 text-left transition-colors duration-150",
                      "hover:bg-surface focus:outline-none",
                      isSelected ? "text-foreground" : "text-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[0.7rem] uppercase tracking-[0.1em]",
                        "font-medium flex items-center gap-1.5",
                        isSelected && "text-gold",
                      )}
                    >
                      <span>{info.symbol}</span>
                      <span>{code}</span>
                    </span>
                    <span
                      className={cn(
                        "text-[0.6rem] tracking-wide",
                        isSelected ? "text-muted" : "text-muted/50",
                      )}
                    >
                      {info.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
