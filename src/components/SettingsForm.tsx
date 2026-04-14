"use client";

import { useActionState } from "react";
import {
  updateSettings,
  type SettingsFormState,
} from "@/app/actions/settings";

const initial: SettingsFormState = {};

export function SettingsForm({
  defaultThreshold,
}: {
  defaultThreshold: number;
}) {
  const [state, formAction, pending] = useActionState(updateSettings, initial);

  return (
    <form
      action={formAction}
      className="max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      {state.success ? (
        <div
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          role="status"
          aria-live="polite"
        >
          Settings saved. Dashboard and product low-stock rules use this value
          for items without their own threshold.
        </div>
      ) : null}
      <div>
        <label
          htmlFor="defaultLowStockThreshold"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Default low stock threshold
        </label>
        <p className="mb-2 text-xs text-slate-500">
          Used when a product has no per-item threshold. Alert when quantity on
          hand is less than or equal to this value.
        </p>
        <input
          id="defaultLowStockThreshold"
          name="defaultLowStockThreshold"
          type="number"
          required
          min={0}
          step={1}
          defaultValue={defaultThreshold}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.defaultLowStockThreshold?.[0] ? (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.defaultLowStockThreshold[0]}
          </p>
        ) : null}
      </div>
      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
