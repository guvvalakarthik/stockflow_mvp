"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const optionalNumber = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  if (typeof v === "string" && v.trim() === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}, z.number().optional());

const optionalInt = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  if (typeof v === "string" && v.trim() === "") return undefined;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : undefined;
}, z.number().int().optional());

const productFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(200),
  sku: z.string().trim().min(1, "SKU is required.").max(80),
  description: z
    .string()
    .trim()
    .max(2000)
    .transform((s) => (s === "" ? undefined : s)),
  quantityOnHand: z.coerce.number().int().min(0, "Quantity cannot be negative."),
  costPrice: optionalNumber,
  sellingPrice: optionalNumber,
  lowStockThreshold: optionalInt,
});

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function requireOrgUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function createProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requireOrgUser();

  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description") ?? "",
    quantityOnHand: formData.get("quantityOnHand"),
    costPrice: formData.get("costPrice"),
    sellingPrice: formData.get("sellingPrice"),
    lowStockThreshold: formData.get("lowStockThreshold"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const data = parsed.data;

  try {
    await prisma.product.create({
      data: {
        organizationId: user.organizationId,
        name: data.name,
        sku: data.sku,
        description: data.description,
        quantityOnHand: data.quantityOnHand,
        costPrice: data.costPrice ?? null,
        sellingPrice: data.sellingPrice ?? null,
        lowStockThreshold: data.lowStockThreshold ?? null,
        lastUpdatedByUserId: user.id,
        lastStockUpdatedAt: new Date(),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint")) {
      return { error: "SKU must be unique within your organization." };
    }
    return { error: "Could not create product." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(
  productId: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const user = await requireOrgUser();

  const parsed = productFormSchema.safeParse({
    name: formData.get("name"),
    sku: formData.get("sku"),
    description: formData.get("description") ?? "",
    quantityOnHand: formData.get("quantityOnHand"),
    costPrice: formData.get("costPrice"),
    sellingPrice: formData.get("sellingPrice"),
    lowStockThreshold: formData.get("lowStockThreshold"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const existing = await prisma.product.findFirst({
    where: { id: productId, organizationId: user.organizationId },
  });
  if (!existing) {
    return { error: "Product not found." };
  }

  const data = parsed.data;

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        sku: data.sku,
        description: data.description,
        quantityOnHand: data.quantityOnHand,
        costPrice: data.costPrice ?? null,
        sellingPrice: data.sellingPrice ?? null,
        lowStockThreshold: data.lowStockThreshold ?? null,
        lastUpdatedByUserId: user.id,
        lastStockUpdatedAt: new Date(),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("Unique constraint")) {
      return { error: "SKU must be unique within your organization." };
    }
    return { error: "Could not update product." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath(`/products/${productId}/edit`);
  redirect("/products");
}

export async function deleteProduct(productId: string) {
  const user = await requireOrgUser();

  await prisma.product.deleteMany({
    where: { id: productId, organizationId: user.organizationId },
  });

  revalidatePath("/dashboard");
  revalidatePath("/products");
  redirect("/products");
}

const adjustSchema = z.object({
  delta: z.coerce.number().int(),
  note: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((s) => (s === "" ? undefined : s)),
});

export type AdjustStockState = { error?: string; fieldErrors?: Record<string, string[] | undefined> };

export async function adjustStock(
  productId: string,
  _prev: AdjustStockState,
  formData: FormData,
): Promise<AdjustStockState> {
  const user = await requireOrgUser();

  const parsed = adjustSchema.safeParse({
    delta: formData.get("delta"),
    note: formData.get("note") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  const { delta, note } = parsed.data;

  const existing = await prisma.product.findFirst({
    where: { id: productId, organizationId: user.organizationId },
  });
  if (!existing) {
    return { error: "Product not found." };
  }

  const nextQty = existing.quantityOnHand + delta;
  if (nextQty < 0) {
    return { error: "Adjustment would make quantity negative." };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      quantityOnHand: nextQty,
      lastStockNote: note ?? (delta >= 0 ? `+${delta}` : `${delta}`),
      lastStockUpdatedAt: new Date(),
      lastUpdatedByUserId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/products");
  revalidatePath(`/products/${productId}/edit`);
  return {};
}
