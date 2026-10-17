export type PaymentResult = {
  success: true;
  orderNumber: string;
  orderId: string;
};

export function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function returnExistingPaymentOnConflict<T extends PaymentResult>(
  createPayment: () => Promise<T>,
  findExistingPayment: () => Promise<T | null>,
): Promise<T> {
  try {
    return await createPayment();
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const existingPayment = await findExistingPayment();
    if (!existingPayment) {
      throw error;
    }

    return existingPayment;
  }
}
