"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { useCartStore } from "@/lib/cart";

export function CartToast() {
  const [show, setShow] = useState(false);
  const [productName, setProductName] = useState("");
  const items = useCartStore((state) => state.items);
  const prevCountRef = useRef(0);

  useEffect(() => {
    const currentCount = items.reduce((a, b) => a + b.quantity, 0);

    if (currentCount > prevCountRef.current) {
      const lastItem = items[items.length - 1];
      setProductName(lastItem?.productName ?? "Item");
      setShow(true);
      setTimeout(() => setShow(false), 4000);
    }

    prevCountRef.current = currentCount;
  }, [items]);

  if (!show) return null;

  return (
    <div className="fixed right-4 bottom-6 left-4 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300 md:right-6 md:left-auto md:w-80">
      <div className="flex items-center gap-3 rounded-2xl border border-gold/20 bg-forest px-4 py-3 text-white shadow-xl">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20">
          <span className="text-sm text-gold">✦</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-snug font-medium text-white">
            Added to your ritual
          </p>
          <p className="mt-0.5 truncate text-[0.65rem] text-white/60">
            {productName}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/cart"
            onClick={() => setShow(false)}
            className="rounded-full border border-gold/30 px-3 py-1 text-[0.6rem] tracking-wide text-gold uppercase transition-colors hover:bg-gold/10"
          >
            View Cart
          </Link>
          <button
            type="button"
            onClick={() => setShow(false)}
            className="text-white/40 transition-colors hover:text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
