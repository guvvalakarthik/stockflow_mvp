import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/SignupForm";
import { getSession } from "@/lib/session";

export default async function SignupPage() {
  const session = await getSession();
  if (session.userId) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          StockFlow
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          One organization per account for this MVP.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
