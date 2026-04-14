"use client";

import { useMemo, useState, useActionState } from "react";
import Link from "next/link";
import { deleteProduct, adjustStock, type AdjustStockState } from "@/app/actions/products";
import { effectiveLowStockThreshold, isLowStock } from "@/lib/stock";

export type ProductRow = {
  id: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  sellingPrice: number | null;
  lowStockThreshold: number | null;
};

type Props = {
  products: ProductRow[];
  orgDefaultThreshold: number;
};

const adjustInitial: AdjustStockState = {};

function AdjustStockForm({
  productId,
}: {
  productId: string;
}) {
  const bound = adjustStock.bind(null, productId);
  const [state, formAction, pending] = useActionState(bound, adjustInitial);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2 text-xs">
      <div>
        <label className="sr-only" htmlFor={`delta-${productId}`}>
          Adjust units (+/-)
        </label>
        <input
          id={`delta-${productId}`}
          name="delta"
          type="number"
          required
          step={1}
          placeholder="±qty"
          className="w-20 rounded border border-slate-300 px-2 py-1 text-slate-900"
        />
      </div>
      <div className="min-w-[120px] flex-1">
        <label className="sr-only" htmlFor={`note-${productId}`}>
          Note
        </label>
        <input
          id={`note-${productId}`}
          name="note"
          type="text"
          placeholder="Note (optional)"
          className="w-full rounded border border-slate-300 px-2 py-1 text-slate-900"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-slate-200 px-2 py-1 font-medium text-slate-800 hover:bg-slate-300 disabled:opacity-50"
      >
        {pending ? "…" : "Adjust"}
      </button>
      {state.error ? (
        <span className="w-full text-red-600">{state.error}</span>
      ) : null}
      {state.fieldErrors?.delta?.[0] ? (
        <span className="w-full text-red-600">{state.fieldErrors.delta[0]}</span>
      ) : null}
    </form>
  );
}

export function ProductsTable({ products, orgDefaultThreshold }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s),
    );
  }, [products, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or SKU…"
          className="w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        <Link
          href="/products/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Low stock</th>
              <th className="px-4 py-3 font-medium">Selling price</th>
              <th className="px-4 py-3 font-medium">Adjust</th>
              <th className="px-4 py-3 font-medium"> </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  {products.length === 0
                    ? "No products yet. Add your first one."
                    : "No matches for your search."}
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const low = isLowStock(
                  p.quantityOnHand,
                  p.lowStockThreshold,
                  orgDefaultThreshold,
                );
                const eff = effectiveLowStockThreshold(
                  p.lowStockThreshold,
                  orgDefaultThreshold,
                );
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.sku}</td>
                    <td className="px-4 py-3 tabular-nums">{p.quantityOnHand}</td>
                    <td className="px-4 py-3">
                      {low ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                          Low (≤ {eff})
                        </span>
                      ) : (
                        <span className="text-slate-400">OK</span>
                      )}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-700">
                      {p.sellingPrice != null ? p.sellingPrice.toFixed(2) : "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <AdjustStockForm productId={p.id} />
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`/products/${p.id}/edit`}
                          className="text-slate-700 underline hover:text-slate-900"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-left text-red-600 underline hover:text-red-800"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete “${p.name}” (${p.sku})? This cannot be undone.`,
                              )
                            ) {
                              void deleteProduct(p.id);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
