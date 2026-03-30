import { useMemo } from 'react'
import { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductInventory {
  activeInventory: IProductVariantDataType['inventory'] | undefined
  maxStock: number
  isOutOfStock: boolean
  isLowStock: boolean
}

export function useProductInventory(
  selectedVariant: IProductVariantDataType | null,
  hasActualVariants: boolean,
  displayVariants: IProductVariantDataType[],
): ProductInventory {
  return useMemo(() => {
    const activeInventory = selectedVariant?.inventory
    const maxStock = activeInventory?.quantity ?? 0

    const isOutOfStock =
      selectedVariant?.inventory?.displayStatus === 'OUT_OF_STOCK' ||
      (hasActualVariants &&
        displayVariants.every(
          (v) => v.inventory?.displayStatus === 'OUT_OF_STOCK',
        ))

    const isLowStock =
      !isOutOfStock &&
      maxStock > 0 &&
      activeInventory?.lowStockThreshold !== undefined &&
      maxStock <= activeInventory.lowStockThreshold

    return { activeInventory, maxStock, isOutOfStock, isLowStock }
  }, [selectedVariant, hasActualVariants, displayVariants])
}
