export const COUPON_CODE = "ANU15";
export const COUPON_DISCOUNT_RATE = 0.15;

export function normalizeCouponCode(code: unknown): string {
  return typeof code === "string" ? code.trim().toUpperCase() : "";
}

export function isValidCouponCode(code: unknown): boolean {
  return normalizeCouponCode(code) === COUPON_CODE;
}

export function calculateCouponDiscount(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    return 0;
  }

  return Math.round(subtotal * COUPON_DISCOUNT_RATE * 100) / 100;
}
