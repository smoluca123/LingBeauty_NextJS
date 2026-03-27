import type { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces'

/**
 * Check if a variant is a default variant (auto-created for simple products)
 */
export function isDefaultVariant(variant: IProductVariantDataType): boolean {
  return (
    variant.sku.endsWith('-DEFAULT') ||
    variant.name === 'Mặc định' ||
    variant.sortOrder === 0
  )
}

/**
 * Check if product only has a default variant (behaves like simple product)
 */
export function hasOnlyDefaultVariant(
  variants: IProductVariantDataType[] | undefined,
): boolean {
  if (!variants || variants.length === 0) return false
  if (variants.length > 1) return false
  return isDefaultVariant(variants[0])
}

/**
 * Get non-default variants (actual product variants)
 */
export function getNonDefaultVariants(
  variants: IProductVariantDataType[] | undefined,
): IProductVariantDataType[] {
  if (!variants) return []
  return variants.filter((v) => !isDefaultVariant(v))
}

/**
 * Get display variants (hide default variant if it's the only one)
 */
export function getDisplayVariants(
  variants: IProductVariantDataType[] | undefined,
): IProductVariantDataType[] {
  if (!variants || variants.length === 0) return []

  // If only default variant, return empty (treat as simple product)
  if (hasOnlyDefaultVariant(variants)) return []

  // Return all variants (including default if there are others)
  return variants
}

/**
 * Check if product should show variant selector
 */
export function shouldShowVariantSelector(
  variants: IProductVariantDataType[] | undefined,
): boolean {
  const displayVariants = getDisplayVariants(variants)
  return displayVariants.length > 1
}

/**
 * Get default variant from list
 */
export function getDefaultVariant(
  variants: IProductVariantDataType[] | undefined,
): IProductVariantDataType | null {
  if (!variants || variants.length === 0) return null
  return variants.find((v) => isDefaultVariant(v)) ?? null
}
