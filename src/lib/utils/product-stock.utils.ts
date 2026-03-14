import type {
  IProductDataType,
  IProductInventoryDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * Determines whether a single inventory record is out of stock.
 * Source of truth: `displayStatus` managed by the server.
 * `quantity === 0` alone does NOT imply out-of-stock.
 */
const isInventoryOutOfStock = (
  inventory: IProductInventoryDataType | null | undefined,
): boolean => inventory?.displayStatus === 'OUT_OF_STOCK';

/**
 * Determines whether a single inventory record is low-stock.
 * Low-stock = still IN_STOCK but quantity <= lowStockThreshold.
 */
const isInventoryLowStock = (
  inventory: IProductInventoryDataType | null | undefined,
): boolean => {
  if (!inventory || isInventoryOutOfStock(inventory)) return false;
  return inventory.quantity <= inventory.lowStockThreshold;
};

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Returns `true` when the product (or ALL its variants) are out of stock.
 *
 * - Products with variants: every variant must have `displayStatus === OUT_OF_STOCK`.
 * - Products without variants: uses product-level inventory `displayStatus`.
 */
export const getIsOutOfStock = (product: IProductDataType): boolean => {
  const variants = product.variants ?? [];

  if (variants.length > 0) {
    return variants.every((v) => isInventoryOutOfStock(v.inventory));
  }

  return isInventoryOutOfStock(product.inventory);
};

/**
 * Returns `true` when at least one available item (variant or product-level)
 * is low-stock (still IN_STOCK but quantity <= lowStockThreshold).
 * Always returns `false` if the product is already fully out of stock.
 */
export const getIsLowStock = (product: IProductDataType): boolean => {
  if (getIsOutOfStock(product)) return false;

  const variants = product.variants ?? [];

  if (variants.length > 0) {
    return variants.some(
      (v) => !isInventoryOutOfStock(v.inventory) && isInventoryLowStock(v.inventory),
    );
  }

  return isInventoryLowStock(product.inventory);
};
