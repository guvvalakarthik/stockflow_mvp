import { getCurrentUser } from "@/lib/auth";
import { SettingsForm } from "@/components/SettingsForm";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-600">
          Organization defaults for low-stock detection.
        </p>
      </div>
      <SettingsForm
        defaultThreshold={user.organization.defaultLowStockThreshold}
      />
    </div>
  );
}
