import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ProductForm } from "@/components/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const product = await prisma.product.findFirst({
    where: { id, organizationId: user.organizationId },
  });

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit product</h1>
        <p className="mt-1 text-slate-600">{product.sku}</p>
      </div>
      <ProductForm
        mode="edit"
        productId={product.id}
        defaultValues={{
          name: product.name,
          sku: product.sku,
          description: product.description ?? "",
          quantityOnHand: product.quantityOnHand,
          costPrice:
            product.costPrice != null ? String(product.costPrice) : "",
          sellingPrice:
            product.sellingPrice != null ? String(product.sellingPrice) : "",
          lowStockThreshold:
            product.lowStockThreshold != null
              ? String(product.lowStockThreshold)
              : "",
        }}
      />
    </div>
  );
}
