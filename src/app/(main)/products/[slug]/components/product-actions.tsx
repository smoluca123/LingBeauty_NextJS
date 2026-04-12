import { ExternalLink, ShoppingCart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/style-utils'
import { AddToWishlistButton } from '@/components/wishlist/add-to-wishlist-button'
import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductActionsProps {
  product: IProductDataType
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
  product,
  productId,
  selectedVariant,
  isOutOfStock,
  hasActualVariants,
  isAuthenticated,
  isPending,
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {
  const isAffiliate = product.productType === 'AFFILIATE'
  const isDisabled =
    isOutOfStock ||
    (hasActualVariants && !selectedVariant) ||
    isPending ||
    !isAuthenticated

  // Affiliate product actions
  if (isAffiliate && product.affiliateLink) {
    return (
      <div className="flex flex-col gap-3 pt-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900">
                Sản phẩm từ {product.affiliateSource || 'đối tác'}
              </p>
              <p className="mt-1 text-xs text-blue-700">
                Bạn sẽ được chuyển đến trang bán hàng để hoàn tất đơn hàng
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() =>
            window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')
          }
          className="w-full rounded-full py-6 text-base font-semibold text-white bg-primary-pink hover:bg-primary-pink/90 hover:shadow-md transition-all"
          size="lg"
        >
          Mua ngay tại {product.affiliateSource || 'đối tác'}
          <ExternalLink className="ml-2 h-5 w-5" />
        </Button>
        <div className="flex gap-3">
          <AddToWishlistButton
            productId={productId}
            iconOnly
            className="flex-1 rounded-full border-primary-pink px-4 py-6 text-primary-pink hover:bg-primary-pink/10"
          />
          <Button
            variant="outline"
            className="flex-1 rounded-full py-6 hover:bg-muted"
            size="lg"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  // Inventory product actions (existing logic)
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
