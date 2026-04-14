"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthFormState } from "@/app/actions/auth";

const initial: AuthFormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Organization name
        </label>
        <input
          name="organizationName"
          type="text"
          required
          placeholder="My Test Store"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.organizationName?.[0] ? (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.organizationName[0]}
          </p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.email?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.password?.[0] ? (
          <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
        ) : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Confirm password
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {state.fieldErrors?.confirmPassword?.[0] ? (
          <p className="mt-1 text-sm text-red-600">
            {state.fieldErrors.confirmPassword[0]}
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
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-slate-900 underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
