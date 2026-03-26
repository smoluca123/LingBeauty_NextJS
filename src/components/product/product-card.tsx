'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { IPropsWithClassName } from '@/lib/types/interfaces/utils.interfaces'
import { StockProgressBar } from '@/components/flash-sale/stock-progress-bar'
import { cn } from '@/lib/utils/style-utils'
import { formatCurrency } from '@/lib/utils/format-utils'
export type Product = {
  id: string
  name: string
  brand: string
  price: number
  originalPrice?: number
  rankLabel?: string
  dealLabel?: string
  image: string
  badges?: ProductBadgeProps[]
  rating?: number
  reviewCount?: number
  variants?: { id: string; name: string; thumbnail?: string; color?: string }[]
}

type ProductCardProps = {
  product: Product
  showStock?: boolean
  soldQuantity?: number
  maxQuantity?: number
} & IPropsWithClassName

export function ProductCard({
  product,
  className,
  showStock = false,
  soldQuantity = 0,
  maxQuantity = 0,
}: ProductCardProps) {
  const {
    name,
    brand,
    price,
    originalPrice,
    rankLabel,
    dealLabel,
    image,
    badges,
    rating,
    reviewCount,
  } = product

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group/product',
        className,
      )}
    >
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {rankLabel && (
          <span className="rounded-full bg-muted px-2 py-1 text-foreground shadow-xs">
            {rankLabel}
          </span>
        )}
        {discountPercent && (
          <span className="text-primary-pink">-{discountPercent}%</span>
        )}
      </div>

      <div className="relative mt-3 aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 220px, (min-width: 768px) 200px, 45vw"
          className="object-cover"
          priority={false}
          unoptimized
        />
        {dealLabel && (
          <span className="absolute bottom-3 left-3 rounded-full bg-primary-pink/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
            {dealLabel}
          </span>
        )}
      </div>

      {badges && badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {badges.map((badge: ProductBadgeProps) => (
            <ProductBadge key={`${product.id}-${badge.label}`} {...badge} />
          ))}
        </div>
      )}

      <div className="mt-3 space-y-1 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {brand}
        </p>
        <h3 className="text-base font-semibold text-foreground line-clamp-3">
          {name}
        </h3>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <p className="text-lg font-semibold text-foreground">
          {formatCurrency(price)}
        </p>
        {originalPrice && (
          <p className="text-sm text-muted-foreground line-through">
            {formatCurrency(originalPrice)}
          </p>
        )}
      </div>

      {/*   Product variants */}
      {product.variants && product.variants.length > 0 && (
        <div className="hidden group-hover/product:block">
          <div className="mt-3 flex items-center gap-1.5 ">
            {product.variants
              .slice(0, 4)
              .map(
                (variant: {
                  id: string
                  name: string
                  thumbnail?: string
                  color?: string
                }) => (
                  <div
                    key={variant.id}
                    className="relative h-6 w-6 overflow-hidden rounded-full border border-muted ring-1 ring-transparent transition-all hover:scale-110 hover:ring-primary-pink/50"
                    title={variant.name}
                  >
                    {variant.thumbnail ? (
                      <Image
                        src={variant.thumbnail}
                        alt={variant.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    ) : variant.color ? (
                      <div
                        className="h-full w-full"
                        style={{ backgroundColor: variant.color }}
                      />
                    ) : null}
                  </div>
                ),
              )}
            {product.variants.length > 4 && (
              <span className="text-[10px] font-medium text-muted-foreground">
                +{product.variants.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stock progress bar */}
      {showStock && maxQuantity > 0 && (
        <div className="mt-3">
          <StockProgressBar
            soldQuantity={soldQuantity}
            maxQuantity={maxQuantity}
          />
        </div>
      )}

      {!showStock && (
        <Button
          variant="outline"
          className="mt-4 rounded-full border-primary-pink text-primary-pink hover:bg-primary-pink/10"
        >
          Xem chi tiết
        </Button>
      )}

      {/*   Product rating */}
      <RatingStars rating={rating} reviewCount={reviewCount} />
    </article>
  )
}

type ProductBadgeProps = {
  label: string
  variant?: 'primary' | 'info' | 'neutral'
}

export function ProductBadge({
  label,
  variant = 'neutral',
}: ProductBadgeProps) {
  const variantClasses: Record<Required<ProductBadgeProps>['variant'], string> =
    {
      primary:
        'bg-primary-pink/10 text-primary-pink border border-primary-pink/30',
      info: 'bg-sky-100 text-sky-700 border border-sky-200',
      neutral: 'bg-muted text-foreground border border-muted-foreground/10',
    }

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide',
        variantClasses[variant],
      )}
    >
      {label}
    </span>
  )
}

type RatingStarsProps = {
  rating?: number
  reviewCount?: number
}

export function RatingStars({ rating, reviewCount }: RatingStarsProps) {
  if (!rating) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        Chưa có đánh giá
        {typeof reviewCount === 'number' &&
          reviewCount > 0 &&
          ` (${reviewCount})`}
      </p>
    )
  }

  return (
    <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground mx-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-4 w-4',
            rating >= index + 1
              ? 'text-amber-400 fill-amber-400'
              : 'text-muted fill-transparent',
          )}
        />
      ))}
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  )
}
