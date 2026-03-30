import { ProductBadge } from '@/components/product/product-badge'
import { formatCurrency } from '@/lib/utils/format-utils'
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductPricingProps {
  basePrice: number
  comparePrice: number | null
  discountPercent: number | null
  product: IProductDataType
}

export function ProductPricing({
  basePrice,
  comparePrice,
  discountPercent,
  product,
}: ProductPricingProps) {
  return (
    <>
      {/* Badges */}
      {product.badges && product.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {discountPercent && (
            <ProductBadge label={`GIẢM ${discountPercent}%`} variant="INFO" />
          )}
          {product.badges.map((badge) => (
            <ProductBadge
              key={badge.id}
              label={badge.name}
              variant={badge.variant}
            />
          ))}
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-bold text-primary-pink">
          {formatCurrency(basePrice)}
        </p>
        {comparePrice && comparePrice > Number(product.basePrice) && (
          <p className="text-lg text-muted-foreground line-through">
            {formatCurrency(comparePrice)}
          </p>
        )}
        {discountPercent && (
          <span className="rounded-full bg-primary-pink/10 px-2 py-0.5 text-xs font-bold text-primary-pink">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Short description */}
      {product.shortDesc && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.shortDesc}
        </p>
      )}
    </>
  )
}
