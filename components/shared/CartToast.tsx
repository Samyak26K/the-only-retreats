"use client";

import { useEffect, useState } from "react";

import { useCartStore } from "@/lib/cart";

export function CartToast() {
  const [show, setShow] = useState(false);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state, prevState) => {
      const newCount = state.getItemCount();
      const oldCount = prevState.getItemCount();

      if (newCount > oldCount) {
        const lastItem = state.items[state.items.length - 1];
        setProductName(lastItem?.productName ?? "Item");
        setShow(true);
        setTimeout(() => setShow(false), 3000);
      }
    });
    return unsubscribe;
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 rounded-full border border-gold/20 bg-forest px-5 py-3 text-white shadow-lg">
        <span className="text-sm text-gold">✦</span>
        <p className="text-sm font-medium whitespace-nowrap">
          {productName} added to your ritual
        </p>
        <a
          href="/cart"
          className="text-xs text-gold/80 underline underline-offset-2 whitespace-nowrap transition-colors hover:text-gold"
        >
          View Cart →
        </a>
      </div>
    </div>
  );
}
