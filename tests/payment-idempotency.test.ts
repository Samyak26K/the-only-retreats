import assert from "node:assert/strict";
import test from "node:test";

import { returnExistingPaymentOnConflict } from "../lib/services/payment-idempotency";

const result = {
  success: true as const,
  orderNumber: "TOR-1",
  orderId: "order-1",
};

test("repeated payment verification returns the existing result", async () => {
  let stored = false;
  const createPayment = async () => {
    if (stored) {
      throw { code: "P2002" };
    }
    stored = true;
    return result;
  };
  const findExistingPayment = async () => (stored ? result : null);

  assert.deepEqual(
    await returnExistingPaymentOnConflict(createPayment, findExistingPayment),
    result,
  );
  assert.deepEqual(
    await returnExistingPaymentOnConflict(createPayment, findExistingPayment),
    result,
  );
});

test("concurrent payment verification resolves both calls to one order", async () => {
  let stored = false;
  const createPayment = async () => {
    await new Promise((resolve) => setImmediate(resolve));
    if (stored) {
      throw { code: "P2002" };
    }
    stored = true;
    return result;
  };
  const findExistingPayment = async () => (stored ? result : null);

  const results = await Promise.all(
    Array.from({ length: 2 }, () =>
      returnExistingPaymentOnConflict(createPayment, findExistingPayment),
    ),
  );

  assert.deepEqual(results, [result, result]);
  assert.equal(stored, true);
});
