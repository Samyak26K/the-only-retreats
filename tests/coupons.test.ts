import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateCouponDiscount,
  isValidCouponCode,
  normalizeCouponCode,
} from "../lib/coupons";
import { calculateCheckoutTotals } from "../lib/services/checkout-pricing";

const items = [
  {
    variantId: "variant-1",
    quantity: 2,
    unitPrice: 100,
    productName: "TOR product",
    variantName: "Standard",
  },
  {
    variantId: "variant-2",
    quantity: 1,
    unitPrice: 33.33,
    productName: "Dhatu product",
    variantName: "Standard",
  },
  {
    variantId: "variant-3",
    quantity: 1,
    unitPrice: 66.67,
    productName: "Divya product",
    variantName: "Standard",
  },
];

test("normalizes ANU15 case and whitespace", () => {
  assert.equal(normalizeCouponCode("  anu15 "), "ANU15");
  assert.equal(isValidCouponCode(" AnU15 "), true);
  assert.equal(isValidCouponCode("OTHER"), false);
});

test("calculates one 15 percent discount from the server-priced subtotal", () => {
  const totals = calculateCheckoutTotals(items, "anu15");
  assert.equal(totals.subtotal, 300);
  assert.equal(totals.discountAmount, 45);
  assert.equal(totals.total, 255);
  assert.equal(totals.couponCode, "ANU15");
  assert.equal(calculateCouponDiscount(totals.subtotal), 45);
});

test("rejects invalid coupons and does not discount without one", () => {
  assert.throws(
    () => calculateCheckoutTotals(items, "NOPE"),
    /Invalid promo code/,
  );
  assert.deepEqual(calculateCheckoutTotals(items, null), {
    subtotal: 300,
    discountAmount: 0,
    total: 300,
    couponCode: null,
  });
});

test("rounds subtotal and discount once", () => {
  const totals = calculateCheckoutTotals(
    [
      {
        variantId: "variant-1",
        quantity: 1,
        unitPrice: 10.01,
        productName: "TOR product",
        variantName: "Standard",
      },
    ],
    "ANU15",
  );
  assert.equal(totals.subtotal, 10.01);
  assert.equal(totals.discountAmount, 1.5);
  assert.equal(totals.total, 8.51);
});
