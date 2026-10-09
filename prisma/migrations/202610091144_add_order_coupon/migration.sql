ALTER TABLE "Order" ADD COLUMN "couponCode" TEXT;

CREATE INDEX "Order_couponCode_idx" ON "Order"("couponCode");
