"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const settingsSchema = z.object({
  defaultLowStockThreshold: z.coerce
    .number()
    .int()
    .min(0, "Must be zero or greater.")
    .max(1_000_000),
});

export type SettingsFormState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function updateSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = settingsSchema.safeParse({
    defaultLowStockThreshold: formData.get("defaultLowStockThreshold"),
  });

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  await prisma.organization.update({
    where: { id: user.organizationId },
    data: { defaultLowStockThreshold: parsed.data.defaultLowStockThreshold },
  });

  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/products");
  return { success: true };
}
