"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlistStore } from "@/lib/wishlist";

export function WishlistSection() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="mb-3 text-2xl">♡</p>
        <p className="mb-3 text-sm text-muted">Your wishlist is empty</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-xs tracking-[0.15em] text-foreground uppercase transition-colors hover:border-gold hover:text-gold"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.productId}
          className="group relative overflow-hidden rounded-xl border border-border"
        >
          <Link href={`/products/${item.productSlug}`}>
            <div className="relative aspect-square bg-surface">
              {item.imageSrc ? (
                <Image
                  src={item.imageSrc}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface">
                  <span className="text-xs text-muted">{item.productName}</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-xs leading-snug font-medium text-foreground">
                {item.productName}
              </p>
              <p className="mt-1 text-xs text-gold">
                ₹{item.price.toLocaleString("en-IN")}
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 transition-colors hover:bg-red-50"
          >
            <Heart className="size-3.5 fill-red-400 text-red-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
