import { useMemo } from 'react'
import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductPricing {
  basePrice: number
  comparePrice: number | null
  discountPercent: number | null
}

export function useProductPricing(
  product: IProductDataType,
  selectedVariant: IProductVariantDataType | null,
): ProductPricing {
  return useMemo(() => {
    const basePrice = selectedVariant
      ? Number(selectedVariant.price)
      : Number(product.basePrice)

    const comparePrice = product.comparePrice
      ? Number(product.comparePrice)
      : null

    const discountPercent =
      comparePrice && comparePrice > Number(product.basePrice)
        ? Math.round(
            ((comparePrice - Number(product.basePrice)) / comparePrice) * 100,
          )
        : null

    return { basePrice, comparePrice, discountPercent }
  }, [product.basePrice, product.comparePrice, selectedVariant])
}
