"use client";

import { useState } from "react";

const fieldClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-gold";

/**
 * Variant rows for the create-product form. Field names follow
 * `variant_<n>_<field>`, which the server action reads back.
 */
export function VariantFields() {
  const [rowIds, setRowIds] = useState<number[]>([]);
  const [nextId, setNextId] = useState(0);

  function addRow() {
    setRowIds((ids) => [...ids, nextId]);
    setNextId((id) => id + 1);
  }

  return (
    <>
      <div className="space-y-4">
        {rowIds.map((i) => (
          <div
            key={i}
            className="relative grid gap-3 rounded-xl border border-border bg-surface p-4 md:grid-cols-6"
          >
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-medium text-foreground">
                Label *
              </span>
              <input
                name={`variant_${i}_label`}
                type="text"
                placeholder="e.g. 250g, 500ml, 1kg"
                required
                className={fieldClassName}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-foreground">SKU</span>
              <input
                name={`variant_${i}_sku`}
                type="text"
                placeholder="TOR-HNY-250"
                className={fieldClassName}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-foreground">
                Price *
              </span>
              <input
                name={`variant_${i}_price`}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                className={fieldClassName}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-foreground">MRP</span>
              <input
                name={`variant_${i}_mrp`}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={fieldClassName}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-foreground">
                Qty & Unit
              </span>
              <div className="flex gap-1">
                <input
                  name={`variant_${i}_qty`}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="250"
                  className="w-16 rounded-lg border border-border bg-background px-2 py-2 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  name={`variant_${i}_unit`}
                  type="text"
                  placeholder="g"
                  className="flex-1 rounded-lg border border-border bg-background px-2 py-2 text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </label>
            <div className="flex items-center justify-between md:col-span-6">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input name={`variant_${i}_default`} type="checkbox" />
                Default variant
              </label>
              <button
                type="button"
                onClick={() => setRowIds((ids) => ids.filter((id) => id !== i))}
                className="text-xs text-muted transition-colors hover:text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-gold hover:text-foreground"
      >
        + Add Variant
      </button>
    </>
  );
}
