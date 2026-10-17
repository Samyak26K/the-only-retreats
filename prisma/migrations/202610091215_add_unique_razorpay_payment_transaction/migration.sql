CREATE UNIQUE INDEX "Payment_provider_providerTransactionId_key"
ON "Payment"("provider", "providerTransactionId");
