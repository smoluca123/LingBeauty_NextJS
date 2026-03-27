'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Package } from 'lucide-react'

import { cn } from '@/lib/utils/style-utils'
import { IPropsWithClassName } from '@/lib/types/interfaces/utils.interfaces'
import {
  IProductDataType,
  IProductVariantDataType,
} from '@/lib/types/interfaces/apis/product.interfaces'
import { StockProgressBar } from '@/components/flash-sale/stock-progress-bar'
import { ProductBadges } from '@/components/product/product-badges'
import {
  ProductImageCarousel,
  ProductImageCarouselRef,
} from '@/components/product/product-image-carousel'
import { ProductVariantSelector } from '@/components/product/product-variant-selector'
import { ProductPrice } from '@/components/product/product-price'
import { ProductHeader } from '@/components/product/product-header'
import { RatingStars } from '@/components/product/rating-stars'
import { useProductImages } from '@/hooks/use-product-images'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { getIsLowStock, getIsOutOfStock } from '@/lib/utils/product-utils'

type ProductCardProps = {
  product: IProductDataType
  showStock?: boolean
  soldQuantity?: number
  maxQuantity?: number
  showAddToCart?: boolean
} & IPropsWithClassName

export function ProductCard2({
  product,
  className,
  showStock = false,
  soldQuantity,
  maxQuantity,
  showAddToCart = false,
}: ProductCardProps) {
  const { name, brand, primaryImage, stats } = product
  const basePrice = Number(product.basePrice)
  const comparePrice = product.comparePrice
    ? Number(product.comparePrice)
    : null

  const carouselRef = useRef<ProductImageCarouselRef>(null)
  const allImages = useProductImages(product)

  // ─── Stock status (shared utility — displayStatus is the source of truth) ─────
  const isOutOfStock = getIsOutOfStock(product)
  const isLowStock = getIsLowStock(product)

  const handleVariantClick = (variant: IProductVariantDataType) => {
    // Sync carousel image
    if (variant.images && variant.images.length > 0) {
      const variantImage = variant.images[0]
      const imageIndex = allImages.findIndex(
        (img) => img.media.url === variantImage.media.url,
      )
      if (imageIndex !== -1) {
        carouselRef.current?.scrollTo(imageIndex)
      }
    }
  }

  const discountPercent =
    comparePrice && comparePrice > basePrice
      ? Math.round(((comparePrice - basePrice) / comparePrice) * 100)
      : null

  // Extract stats data with fallbacks
  const avgRating = stats?.avgRating ? Number(stats.avgRating) : undefined
  const reviewCount = stats?.reviewCount ?? 0
  const totalSold = stats?.totalSold ?? 0

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group/product',
        isOutOfStock && 'opacity-75',
        className,
      )}
    >
      <ProductHeader discountPercent={discountPercent} />

      {/* Image with out-of-stock overlay */}
      <div className="relative">
        <ProductImageCarousel
          ref={carouselRef}
          images={allImages}
          productName={name}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 pointer-events-none">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-destructive shadow">
              Hết hàng
            </span>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-2 right-2 pointer-events-none">
            <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              Sắp hết
            </span>
          </div>
        )}
      </div>
      <ProductBadges product={product} />

      <div className="mt-3 space-y-1 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {brand.name}
        </p>
        <h3 className="text-base font-semibold text-foreground line-clamp-2">
          {name}
        </h3>
      </div>

      {/* Rating and Stats Section */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <RatingStars rating={avgRating} reviewCount={reviewCount} />
        {totalSold > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Đã bán {totalSold.toLocaleString('vi-VN')}</span>
          </div>
        )}
      </div>

      <ProductPrice basePrice={basePrice} comparePrice={comparePrice} />

      <ProductVariantSelector
        variants={product.variants}
        primaryImage={primaryImage}
        onVariantClick={handleVariantClick}
      />

      {/* Stock progress bar for flash sale */}
      {showStock && typeof maxQuantity === 'number' && (
        <div className="mt-3">
          <StockProgressBar
            soldQuantity={soldQuantity ?? 0}
            maxQuantity={maxQuantity}
          />
        </div>
      )}

      {/* Add to cart button */}
      {(showAddToCart || !showStock) && <AddToCartButton product={product} />}

      {/* View detail link */}
      <Link
        href={`/products/${product.slug}`}
        className="mt-2 flex h-9 w-full items-center justify-center rounded-full border border-primary-pink text-sm font-semibold text-primary-pink hover:bg-primary-pink/10 transition-colors"
      >
        Xem chi tiết
      </Link>
    </article>
  )
}
