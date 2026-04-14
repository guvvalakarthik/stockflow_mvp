import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ProductsTable } from "@/components/ProductsTable";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const products = await prisma.product.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      sku: true,
      quantityOnHand: true,
      sellingPrice: true,
      lowStockThreshold: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>
        <p className="mt-1 text-slate-600">
          Manage inventory for your organization.
        </p>
      </div>
      <ProductsTable
        products={products}
        orgDefaultThreshold={user.organization.defaultLowStockThreshold}
      />
    </div>
  );
}
