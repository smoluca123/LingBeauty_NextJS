'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'
import { useAddToCartMutation } from '@/hooks/mutations/cart.mutation'
import { AddToCartDialog } from '@/components/cart/add-to-cart-dialog'
import { useIsAuthenticated } from '@/hooks/use-auth'
import { cn } from '@/lib/utils/style-utils'
import { getIsOutOfStock } from '@/lib/utils/product-utils'
import {
  getDisplayVariants,
  hasOnlyDefaultVariant,
} from '@/lib/utils/variant-utils'

interface AddToCartButtonProps {
  product: IProductDataType
  className?: string
}

/**
 * Smart "Add to Cart" button for product cards.
 *
 * - Simple product (only default variant): adds directly without variantId (backend auto-selects)
 * - Single variant: adds directly with variantId
 * - Multiple variants: opens dialog to pick variant + quantity
 * - Not authenticated: triggers auth flow
 */
export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const addToCartMutation = useAddToCartMutation()

  const variants = product.variants ?? []
  const displayVariants = getDisplayVariants(variants)
  const isSimpleProduct = hasOnlyDefaultVariant(variants)
  const hasMultipleVariants = displayVariants.length > 1
  const singleVariant = displayVariants.length === 1 ? displayVariants[0] : null

  const isOutOfStock = getIsOutOfStock(product)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      // TODO: trigger login modal when auth flow is refactored to context
      return
    }

    if (isOutOfStock) return

    if (hasMultipleVariants) {
      // Open variant selection dialog
      setDialogOpen(true)
      return
    }

    if (singleVariant) {
      // Single-variant product
      addToCartMutation.mutate({
        productId: product.id,
        variantId: singleVariant.id,
        quantity: 1,
      })
      return
    }

    // Simple product (only default variant) — omit variantId, backend auto-selects
    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    })
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={
          isOutOfStock || (addToCartMutation.isPending && !hasMultipleVariants)
        }
        className={cn(
          'mt-3 w-full h-9 rounded-full gap-2 text-sm font-semibold',
          'bg-primary-pink hover:bg-primary-pink/90 text-white',
          isOutOfStock &&
            'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted',
          className,
        )}
        aria-label={isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
      >
        {addToCartMutation.isPending && !hasMultipleVariants ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Đang thêm...
          </>
        ) : isOutOfStock ? (
          'Hết hàng'
        ) : (
          <>
            <ShoppingBag className="h-3.5 w-3.5" />
            {hasMultipleVariants ? 'Chọn & thêm vào giỏ' : 'Thêm vào giỏ hàng'}
          </>
        )}
      </Button>

      {/* Variant selection dialog (only rendered for multi-variant products) */}
      {hasMultipleVariants && (
        <AddToCartDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          product={product}
        />
      )}
    </>
  )
}
