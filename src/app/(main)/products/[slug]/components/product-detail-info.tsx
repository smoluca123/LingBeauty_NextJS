'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'
import { useAddToCartMutation } from '@/hooks/mutations/cart.mutation'
import { useIsAuthenticated } from '@/hooks/use-auth'
import {
  getDisplayVariants,
  hasOnlyDefaultVariant,
} from '@/lib/utils/variant-utils'
import { useProductPricing } from '@/hooks/use-product-pricing'
import { useProductInventory } from '@/hooks/use-product-inventory'
import { ProductHeader } from './product-header'
import { ProductPricing } from './product-pricing'
import { ProductStockStatus } from './product-stock-status'
import { VariantSelector } from './variant-selector'
import { QuantitySelector } from './quantity-selector'
import { ProductActions } from './product-actions'
import { ProductBenefits } from './product-benefits'

interface ProductDetailInfoProps {
  product: IProductDataType
}

export function ProductDetailInfo({ product }: ProductDetailInfoProps) {
  const router = useRouter()
  const addToCartMutation = useAddToCartMutation()
  const isAuthenticated = useIsAuthenticated()

  // Memoize variant calculations
  const displayVariants = useMemo(
    () => getDisplayVariants(product.variants),
    [product.variants],
  )
  const isSimpleProduct = useMemo(
    () => hasOnlyDefaultVariant(product.variants),
    [product.variants],
  )
  const hasActualVariants = displayVariants.length > 0

  // Determine default variant
  const defaultVariant = useMemo(() => {
    if (isSimpleProduct) {
      return product.variants?.[0] ?? null
    }
    return (
      displayVariants.find(
        (v) => v.inventory?.displayStatus !== 'OUT_OF_STOCK',
      ) ??
      displayVariants[0] ??
      null
    )
  }, [isSimpleProduct, product.variants, displayVariants])

  const [selectedVariant, setSelectedVariant] =
    useState<IProductVariantDataType | null>(defaultVariant)
  const [quantity, setQuantity] = useState(1)

  // Use custom hooks for pricing and inventory
  const { basePrice, comparePrice, discountPercent } = useProductPricing(
    product,
    selectedVariant,
  )
  const { maxStock, isOutOfStock, isLowStock } = useProductInventory(
    selectedVariant,
    hasActualVariants,
    displayVariants,
  )

  // Memoized event handlers
  const handleVariantSelect = useCallback(
    (variant: IProductVariantDataType) => {
      setSelectedVariant(variant)
      setQuantity(1)
    },
    [],
  )

  const handleDecrement = useCallback(
    () => setQuantity((prev) => Math.max(1, prev - 1)),
    [],
  )

  const handleIncrement = useCallback(
    () => setQuantity((prev) => Math.min(maxStock, prev + 1)),
    [maxStock],
  )

  const handleAddToCart = useCallback(() => {
    if (isOutOfStock) return

    const payload = isSimpleProduct
      ? { productId: product.id, quantity }
      : { productId: product.id, variantId: selectedVariant?.id, quantity }

    if (!isSimpleProduct && !selectedVariant) return

    addToCartMutation.mutate(payload)
  }, [
    isOutOfStock,
    isSimpleProduct,
    product.id,
    quantity,
    selectedVariant,
    addToCartMutation,
  ])

  const handleBuyNow = useCallback(() => {
    if (isOutOfStock) return

    const payload = isSimpleProduct
      ? { productId: product.id, quantity }
      : { productId: product.id, variantId: selectedVariant?.id, quantity }

    if (!isSimpleProduct && !selectedVariant) return

    addToCartMutation.mutate(payload, {
      onSuccess: () => {
        router.push('/cart')
      },
    })
  }, [
    isOutOfStock,
    isSimpleProduct,
    product.id,
    quantity,
    selectedVariant,
    addToCartMutation,
    router,
  ])

  return (
    <div className="flex flex-col gap-5">
      <ProductHeader product={product} />

      <ProductPricing
        basePrice={basePrice}
        comparePrice={comparePrice}
        discountPercent={discountPercent}
        product={product}
      />

      {/* Stock status for simple products (no variant selector) */}
      {isSimpleProduct && (
        <ProductStockStatus
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
          maxStock={maxStock}
        />
      )}

      {/* Variant selector (only for products with actual variants) */}
      {hasActualVariants && (
        <VariantSelector
          displayVariants={displayVariants}
          selectedVariant={selectedVariant}
          onSelect={handleVariantSelect}
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
          maxStock={maxStock}
        />
      )}

      {/* Quantity selector */}
      {!isOutOfStock && (
        <QuantitySelector
          quantity={quantity}
          maxStock={maxStock}
          isOutOfStock={isOutOfStock}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      )}

      {/* Action buttons */}
      <ProductActions
        product={product}
        productId={product.id}
        selectedVariant={selectedVariant}
        isOutOfStock={isOutOfStock}
        hasActualVariants={hasActualVariants}
        isAuthenticated={isAuthenticated}
        isPending={addToCartMutation.isPending}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Benefits strip */}
      <ProductBenefits />
    </div>
  )
}
