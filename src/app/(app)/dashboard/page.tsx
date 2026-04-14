import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isLowStock, effectiveLowStockThreshold } from "@/lib/stock";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const orgId = user.organizationId;
  const orgDefault = user.organization.defaultLowStockThreshold;

  const products = await prisma.product.findMany({
    where: { organizationId: orgId },
    orderBy: { name: "asc" },
  });

  const totalProducts = products.length;
  const totalUnits = products.reduce((s, p) => s + p.quantityOnHand, 0);

  const lowStockItems = products.filter((p) =>
    isLowStock(p.quantityOnHand, p.lowStockThreshold, orgDefault),
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Overview for {user.organization.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total products</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {totalProducts}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Units on hand (sum)
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
            {totalUnits}
          </p>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Low stock items</h2>
          <p className="mt-0.5 text-sm text-slate-600">
            Quantity ≤ threshold (product override or default {orgDefault}).
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Quantity on hand</th>
                <th className="px-6 py-3 font-medium">Low stock threshold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No low-stock items. You are in good shape.
                  </td>
                </tr>
              ) : (
                lowStockItems.map((p) => {
                  const eff = effectiveLowStockThreshold(
                    p.lowStockThreshold,
                    orgDefault,
                  );
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-3 font-medium text-slate-900">
                        {p.name}
                      </td>
                      <td className="px-6 py-3 text-slate-600">{p.sku}</td>
                      <td className="px-6 py-3 tabular-nums">{p.quantityOnHand}</td>
                      <td className="px-6 py-3 tabular-nums text-slate-700">
                        {eff}
                        {p.lowStockThreshold == null ? (
                          <span className="ml-1 text-xs text-slate-400">(default)</span>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
