import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">New product</h1>
        <p className="mt-1 text-slate-600">Add an item to your catalog.</p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
