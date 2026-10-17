import { prisma } from "@/lib/prisma";
import {
  calculateCouponDiscount,
  isValidCouponCode,
  normalizeCouponCode,
} from "@/lib/coupons";

export type CheckoutPricingItem = {
  variantId: string;
  quantity: number;
};

export type CheckoutPricing = {
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  items: Array<{
    variantId: string;
    quantity: number;
    unitPrice: number;
    productName: string;
    variantName: string;
  }>;
};

export type PricedCheckoutItem = CheckoutPricing["items"][number];

export function calculateCheckoutTotals(
  items: PricedCheckoutItem[],
  inputCouponCode: unknown,
): Pick<
  CheckoutPricing,
  "subtotal" | "discountAmount" | "total" | "couponCode"
> {
  const subtotal =
    Math.round(
      items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) *
        100,
    ) / 100;
  const couponCode = normalizeCouponCode(inputCouponCode);
  if (couponCode && !isValidCouponCode(couponCode)) {
    throw new Error("Invalid promo code");
  }
  const normalizedCouponCode = couponCode || null;
  const discountAmount = normalizedCouponCode
    ? calculateCouponDiscount(subtotal)
    : 0;

  return {
    subtotal,
    discountAmount,
    total: Math.round((subtotal - discountAmount) * 100) / 100,
    couponCode: normalizedCouponCode,
  };
}

export async function calculateCheckoutPricing(
  inputItems: unknown,
  inputCouponCode: unknown,
): Promise<CheckoutPricing> {
  if (!Array.isArray(inputItems) || inputItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const requestedItems = new Map<string, number>();
  for (const item of inputItems) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof (item as { variantId?: unknown }).variantId !== "string" ||
      !Number.isInteger((item as { quantity?: unknown }).quantity) ||
      (item as { quantity: number }).quantity <= 0
    ) {
      throw new Error("Invalid cart item");
    }

    const variantId = (item as { variantId: string }).variantId;
    const quantity = (item as { quantity: number }).quantity;
    if (requestedItems.has(variantId)) {
      throw new Error("Duplicate cart item");
    }
    requestedItems.set(variantId, quantity);
  }

  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: [...requestedItems.keys()] },
      status: "ACTIVE",
    },
    select: {
      id: true,
      sellingPrice: true,
      name: true,
      product: { select: { name: true } },
    },
  });

  if (variants.length !== requestedItems.size) {
    throw new Error("One or more products are unavailable");
  }

  const items = variants.map((variant) => ({
    variantId: variant.id,
    quantity: requestedItems.get(variant.id)!,
    unitPrice: Number(variant.sellingPrice),
    productName: variant.product.name,
    variantName: variant.name,
  }));
  const totals = calculateCheckoutTotals(items, inputCouponCode);

  return {
    ...totals,
    items,
  };
}
