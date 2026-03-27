'use client'

import { useState, useMemo, useCallback } from 'react'
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
import { toast } from 'sonner'

// ── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_QUANTITY = 1

// ── Types ──────────────────────────────────────────────────────────────────────

interface AddToCartButtonProps {
  product: IProductDataType
  className?: string
  onAuthRequired?: () => void // Callback for when user needs to login
}

type VariantStrategy = 'simple' | 'single' | 'multiple'

// ── Component ──────────────────────────────────────────────────────────────────

/**
 * Smart "Add to Cart" button for product cards.
 *
 * Behavior:
 * - Simple product (only default variant): adds directly without variantId (backend auto-selects)
 * - Single variant: adds directly with variantId
 * - Multiple variants: opens dialog to pick variant + quantity
 * - Not authenticated: triggers auth callback or shows toast
 * - Out of stock: button disabled with appropriate styling
 */
export function AddToCartButton({
  product,
  className,
  onAuthRequired,
}: AddToCartButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const isAuthenticated = useIsAuthenticated()
  const addToCartMutation = useAddToCartMutation()

  // ── Derived State (Memoized) ────────────────────────────────────────────────

  const variantInfo = useMemo(() => {
    const variants = product.variants ?? []
    const displayVariants = getDisplayVariants(variants)
    const isSimple = hasOnlyDefaultVariant(variants)

    let strategy: VariantStrategy
    let selectedVariant = null

    if (isSimple) {
      strategy = 'simple'
    } else if (displayVariants.length === 1) {
      strategy = 'single'
      selectedVariant = displayVariants[0]
    } else {
      strategy = 'multiple'
    }

    return {
      strategy,
      selectedVariant,
      hasMultiple: strategy === 'multiple',
    }
  }, [product.variants])

  const isOutOfStock = useMemo(() => getIsOutOfStock(product), [product])

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAuthRequired = useCallback(() => {
    if (onAuthRequired) {
      onAuthRequired()
    } else {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
    }
  }, [onAuthRequired])

  const handleAddToCart = useCallback(
    (variantId?: string) => {
      addToCartMutation.mutate({
        productId: product.id,
        ...(variantId && { variantId }),
        quantity: DEFAULT_QUANTITY,
      })
    },
    [addToCartMutation, product.id],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Guard: Authentication check
      if (!isAuthenticated) {
        handleAuthRequired()
        return
      }

      // Guard: Stock check
      if (isOutOfStock) {
        return
      }

      // Strategy pattern for variant handling
      switch (variantInfo.strategy) {
        case 'multiple':
          setDialogOpen(true)
          break

        case 'single':
          handleAddToCart(variantInfo.selectedVariant?.id)
          break

        case 'simple':
          handleAddToCart() // No variantId - backend auto-selects
          break
      }
    },
    [
      isAuthenticated,
      isOutOfStock,
      variantInfo,
      handleAuthRequired,
      handleAddToCart,
    ],
  )

  // ── Render Helpers ─────────────────────────────────────────────────────────

  const isLoading = addToCartMutation.isPending && !variantInfo.hasMultiple
  const isDisabled = isOutOfStock || isLoading

  const buttonText = useMemo(() => {
    if (isLoading) return 'Đang thêm...'
    if (isOutOfStock) return 'Hết hàng'
    return variantInfo.hasMultiple ? 'Chọn & thêm vào giỏ' : 'Thêm vào giỏ hàng'
  }, [isLoading, isOutOfStock, variantInfo.hasMultiple])

  const buttonIcon = useMemo(() => {
    if (isLoading) {
      return (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )
    }
    if (!isOutOfStock) {
      return <ShoppingBag className="h-3.5 w-3.5" />
    }
    return null
  }, [isLoading, isOutOfStock])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isDisabled}
        className={cn(
          'mt-3 w-full h-9 rounded-full gap-2 text-sm font-semibold',
          'bg-primary-pink hover:bg-primary-pink/90 text-white',
          'transition-all duration-200',
          isOutOfStock &&
            'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted',
          className,
        )}
        aria-label={isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        aria-busy={isLoading}
      >
        {buttonIcon}
        {buttonText}
      </Button>

      {/* Always render dialog, control visibility with open prop */}
      <AddToCartDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={product}
      />
    </>
  )
}
