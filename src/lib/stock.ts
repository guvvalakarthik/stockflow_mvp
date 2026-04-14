export function effectiveLowStockThreshold(
  productThreshold: number | null | undefined,
  orgDefault: number,
) {
  return productThreshold ?? orgDefault;
}

export function isLowStock(
  quantityOnHand: number,
  productThreshold: number | null | undefined,
  orgDefault: number,
) {
  const t = effectiveLowStockThreshold(productThreshold, orgDefault);
  return quantityOnHand <= t;
}
