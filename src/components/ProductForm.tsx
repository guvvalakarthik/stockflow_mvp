"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/app/actions/products";

const initial: ProductFormState = {};

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  defaultValues?: {
    name: string;
    sku: string;
    description: string;
    quantityOnHand: number;
    costPrice: string;
    sellingPrice: string;
    lowStockThreshold: string;
  };
};

export function ProductForm({ mode, productId, defaultValues }: ProductFormProps) {
  const action =
    mode === "create"
      ? createProduct
      : updateProduct.bind(null, productId!);

  const [state, formAction, pending] = useActionState(action, initial);

  const d = defaultValues;

  return (
    <form action={formAction} className="mx-auto max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          type="text"
          required
          defaultValue={d?.name}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.name?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          SKU <span className="text-red-500">*</span>
        </label>
        <input
          name="sku"
          type="text"
          required
          defaultValue={d?.sku}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.sku?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.sku[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={d?.description}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.description?.[0] ? (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Quantity on hand <span className="text-red-500">*</span>
        </label>
        <input
          name="quantityOnHand"
          type="number"
          required
          min={0}
          step={1}
          defaultValue={d?.quantityOnHand ?? 0}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.quantityOnHand?.[0] ? (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.quantityOnHand[0]}
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Cost price
          </label>
          <input
            name="costPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={d?.costPrice}
            placeholder="Optional"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {state.fieldErrors?.costPrice?.[0] ? (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.costPrice[0]}
            </p>
          ) : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Selling price
          </label>
          <input
            name="sellingPrice"
            type="number"
            min={0}
            step="0.01"
            defaultValue={d?.sellingPrice}
            placeholder="Optional"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
          {state.fieldErrors?.sellingPrice?.[0] ? (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.sellingPrice[0]}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Low stock threshold
        </label>
        <input
          name="lowStockThreshold"
          type="number"
          min={0}
          step={1}
          defaultValue={d?.lowStockThreshold}
          placeholder="Uses org default if empty"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.lowStockThreshold?.[0] ? (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.lowStockThreshold[0]}
          </p>
        ) : null}
      </div>
      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <Link
          href="/products"
          className="rounded-md border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
