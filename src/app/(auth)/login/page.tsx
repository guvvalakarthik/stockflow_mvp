import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session.userId) redirect("/dashboard");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          StockFlow
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
          Log in
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in to your organization workspace.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
