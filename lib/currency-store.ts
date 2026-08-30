import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CurrencyCode } from "./currency";

type CurrencyStore = {
  currency: CurrencyCode;
  rate: number;
  setCurrency: (currency: CurrencyCode, rate: number) => void;
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      currency: "INR",
      rate: 1,
      setCurrency: (currency, rate) => set({ currency, rate }),
    }),
    { name: "tor-currency" },
  ),
);
