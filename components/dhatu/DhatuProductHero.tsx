"use client";

import { Heart, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { useCartStore } from "@/lib/cart";
import { useWishlistStore } from "@/lib/wishlist";

type Variant = {
  id: string;
  label: string;
  sellingPrice: number;
  isDefault: boolean;
  status: string;
};

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string | null;
    currency: string;
    variants: Variant[];
    images: Array<{ url: string; alt: string | null }>;
    altitude: string | null;
    region: string | null;
  };
};

export function DhatuProductHero({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((v) => v.isDefault) ?? product.variants[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isWishlisted = useWishlistStore((state) =>
    state.isWishlisted(product.id),
  );
  const wishlisted = mounted && isWishlisted;

  const currentImage = product.images[imageIndex];

  useEffect(() => setMounted(true), []);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      variantLabel: selectedVariant.label,
      price: selectedVariant.sellingPrice,
      currency: product.currency,
      imageSrc: product.images[0]?.url ?? "",
      imageAlt: product.images[0]?.alt ?? product.name,
    });
    if (quantity > 1) {
      updateQuantity(selectedVariant.id, quantity);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      {/* LEFT: Images */}
      <div>
        {/* Main image */}
        <div
          className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-2xl"
          style={{ backgroundColor: "#241812" }}
        >
          {currentImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentImage.url}
              alt={currentImage.alt ?? product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <p
              className="font-display text-6xl opacity-10"
              style={{ color: "#B25B32" }}
            >
              ✦
            </p>
          )}
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 ? (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setImageIndex(i)}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors"
                style={{
                  borderColor: i === imageIndex ? "#B25B32" : "#5A3A2A",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt ?? ""}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* RIGHT: Info */}
      <div className="space-y-5">
        {/* Category / origin */}
        <p
          className="text-[0.6rem] uppercase tracking-[0.3em]"
          style={{ color: "#B25B32" }}
        >
          Dhatu · Handcrafted Heritage
        </p>

        {/* Name */}
        <h1
          className="font-display text-3xl leading-tight md:text-4xl"
          style={{ color: "#F2EBE0" }}
        >
          {product.name}
        </h1>

        {/* Region + altitude */}
        {product.region || product.altitude ? (
          <p
            className="text-[0.6rem] uppercase tracking-[0.15em]"
            style={{ color: "#5A3A2A" }}
          >
            {[product.region, product.altitude].filter(Boolean).join(" · ")}
          </p>
        ) : null}

        {/* Price */}
        <div>
          <p className="font-display text-2xl" style={{ color: "#C89B4A" }}>
            ₹{selectedVariant?.sellingPrice.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-[0.6rem]" style={{ color: "#5A3A2A" }}>
            Inclusive of all taxes
          </p>
        </div>

        {/* Description */}
        {product.shortDescription ? (
          <p className="text-sm leading-7" style={{ color: "#B8A98F" }}>
            {product.shortDescription}
          </p>
        ) : null}

        {/* Variants - only show if more than 1 */}
        {product.variants.length > 1 ? (
          <div>
            <p
              className="mb-3 text-[0.6rem] uppercase tracking-[0.2em]"
              style={{ color: "#B8A98F" }}
            >
              Size / Variant
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  type="button"
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className="rounded-full border px-4 py-2 text-xs tracking-[0.15em] uppercase transition-all"
                  style={{
                    borderColor:
                      selectedVariant?.id === variant.id
                        ? "#B25B32"
                        : "#5A3A2A",
                    backgroundColor:
                      selectedVariant?.id === variant.id
                        ? "#B25B32"
                        : "transparent",
                    color:
                      selectedVariant?.id === variant.id
                        ? "#F2EBE0"
                        : "#B8A98F",
                  }}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Quantity */}
        <div>
          <p
            className="mb-3 text-[0.6rem] uppercase tracking-[0.2em]"
            style={{ color: "#B8A98F" }}
          >
            Quantity
          </p>
          <div
            className="flex w-fit items-center overflow-hidden rounded-full border"
            style={{ borderColor: "#5A3A2A" }}
          >
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center"
              style={{ color: "#B8A98F" }}
            >
              <Minus className="size-3.5" />
            </button>
            <span
              className="w-10 text-center text-sm"
              style={{ color: "#F2EBE0" }}
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-11 w-11 items-center justify-center"
              style={{ color: "#B8A98F" }}
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Add to cart + wishlist */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="h-12 flex-1 rounded-full text-xs font-medium tracking-[0.25em] uppercase transition-all"
            style={{
              backgroundColor: added ? "#5A3A2A" : "#B25B32",
              color: "#F2EBE0",
            }}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={() =>
              wishlisted
                ? removeFromWishlist(product.id)
                : addToWishlist({
                    productId: product.id,
                    productSlug: product.slug,
                    productName: product.name,
                    imageSrc: product.images[0]?.url ?? "",
                    price: selectedVariant?.sellingPrice ?? 0,
                    currency: product.currency,
                  })
            }
            className="flex h-12 w-12 items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: wishlisted ? "#B25B32" : "#5A3A2A",
              color: wishlisted ? "#B25B32" : "#B8A98F",
            }}
          >
            <Heart className={`size-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Feature badges */}
        <div
          className="grid grid-cols-2 gap-3 pt-4"
          style={{ borderTop: "1px solid #5A3A2A" }}
        >
          {[
            "Handcrafted",
            "Traditional Method",
            "No Machine Replication",
            "Ayurvedic Benefits",
          ].map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "#C89B4A" }}>
                +
              </span>
              <p
                className="text-[0.65rem] uppercase tracking-[0.1em]"
                style={{ color: "#B8A98F" }}
              >
                {badge}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
