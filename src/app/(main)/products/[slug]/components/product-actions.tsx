import { ShoppingCart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/style-utils'
import { AddToWishlistButton } from '@/components/wishlist/add-to-wishlist-button'
import { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductActionsProps {
  productId: string
  selectedVariant: IProductVariantDataType | null
  isOutOfStock: boolean
  hasActualVariants: boolean
  isAuthenticated: boolean
  isPending: boolean
  onAddToCart: () => void
  onBuyNow: () => void
}

export function ProductActions({
  productId,
  selectedVariant,
  isOutOfStock,
  hasActualVariants,
  isAuthenticated,
  isPending,
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  const isDisabled =
    isOutOfStock ||
    (hasActualVariants && !selectedVariant) ||
    isPending ||
    !isAuthenticated

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <div className="flex flex-1 gap-3">
        <Button
          onClick={onAddToCart}
          disabled={isDisabled}
          variant="outline"
          className={cn(
            'flex-1 rounded-full py-6 text-base font-semibold transition-all border-primary-pink text-primary-pink hover:bg-primary-pink/10',
            isOutOfStock &&
              'border-muted text-muted-foreground cursor-not-allowed hover:bg-transparent',
          )}
          size="lg"
          aria-label={isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        >
          {isPending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-pink border-t-transparent" />
              Đang thêm...
            </>
          ) : isOutOfStock ? (
            'Hết hàng'
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ
            </>
          )}
        </Button>
        <Button
          onClick={onBuyNow}
          disabled={isDisabled}
          className={cn(
            'flex-1 rounded-full py-6 text-base font-semibold text-white transition-all',
            isOutOfStock
              ? 'bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted'
              : 'bg-primary-pink hover:bg-primary-pink/90 hover:shadow-md',
          )}
          size="lg"
          aria-label={isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
        >
          {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
        </Button>
      </div>
      <AddToWishlistButton
        productId={productId}
        variantId={selectedVariant?.id}
        iconOnly
        className="w-auto shrink-0 rounded-full border-primary-pink px-4 py-6 text-primary-pink hover:bg-primary-pink/10"
      />
      <Button
        variant="outline"
        className="rounded-full py-6 hover:bg-muted"
        size="lg"
      >
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
