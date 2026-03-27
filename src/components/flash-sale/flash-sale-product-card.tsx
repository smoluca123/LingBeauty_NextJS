'use client'

import { cn } from '@/lib/utils/style-utils'
import { isSoldOut } from '@/lib/utils/flash-sale-utils'
import { ProductCard2 } from '@/components/product/product-card2'
import type { IFlashSaleProductDataType } from '@/lib/types/interfaces/apis/flash-sale.interfaces'
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'

interface FlashSaleProductCardProps {
  product: IFlashSaleProductDataType
  className?: string
}

export function FlashSaleProductCard({
  product,
  className,
}: FlashSaleProductCardProps) {
  const { flashPrice, originalPrice, maxQuantity, soldQuantity } = product

  const soldOut = isSoldOut(soldQuantity, maxQuantity)

  // Parse prices from string to number (BE returns prices as strings)
  const parsedFlashPrice =
    typeof flashPrice === 'string' ? parseFloat(flashPrice) : flashPrice
  const parsedOriginalPrice =
    typeof originalPrice === 'string'
      ? parseFloat(originalPrice)
      : originalPrice

  const productData: IProductDataType = {
    ...product.product,
    basePrice: parsedFlashPrice.toString(),
    comparePrice: parsedOriginalPrice.toString(),
  }

  return (
    <div className={cn('relative h-full', soldOut && 'opacity-75', className)}>
      {/* Sold out overlay */}
      {soldOut && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/50">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">
            Hết hàng
          </span>
        </div>
      )}

      <ProductCard2
        product={productData}
        className={cn(
          'border-2 border-pink-200 hover:border-pink-300',
          soldOut && 'pointer-events-none',
        )}
        showStock
        soldQuantity={soldQuantity}
        maxQuantity={maxQuantity}
        showAddToCart
      />
    </div>
  )
}
