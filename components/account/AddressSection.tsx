"use client";

import { useEffect, useState } from "react";

import { useAddressStore } from "@/lib/addresses";

export function AddressSection() {
  const addresses = useAddressStore((state) => state.addresses);
  const removeAddress = useAddressStore((state) => state.removeAddress);
  const setDefault = useAddressStore((state) => state.setDefault);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="mb-1 text-sm text-muted">No saved addresses yet</p>
        <p className="text-xs text-muted/60">
          Your address will be saved after your first order
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="relative rounded-xl border border-border p-4 transition-colors hover:border-gold/50"
        >
          {address.isDefault ? (
            <span className="absolute top-3 right-3 rounded-full border border-gold/30 px-2 py-0.5 text-[0.55rem] tracking-wide text-gold uppercase">
              Default
            </span>
          ) : null}
          <p className="text-sm font-medium text-foreground">
            {address.fullName}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            {address.addressLine1}
            {address.addressLine2 ? `, ${address.addressLine2}` : null}
            <br />
            {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="mt-1 text-xs text-muted">{address.phone}</p>
          <div className="mt-3 flex gap-3">
            {!address.isDefault ? (
              <button
                type="button"
                onClick={() => setDefault(address.id)}
                className="text-xs text-gold underline-offset-2 hover:underline"
              >
                Set as default
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => removeAddress(address.id)}
              className="text-xs text-muted transition-colors hover:text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
