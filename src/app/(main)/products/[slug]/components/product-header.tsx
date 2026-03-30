import { RatingStars } from '@/components/product/rating-stars'
import { IProductDataType } from '@/lib/types/interfaces/apis/product.interfaces'

interface ProductHeaderProps {
  product: IProductDataType
}

export function ProductHeader({ product }: ProductHeaderProps) {
  const brandName = product.brand?.name
  const categoryNames = product.productCategories
    ?.map((pc) => pc.category?.name)
    .filter(Boolean)
    .join(', ')

  const avgRating = product.stats?.avgRating
    ? Number(product.stats.avgRating)
    : undefined
  const reviewCount = product.stats?.reviewCount ?? 0
  const totalSold = product.stats?.totalSold ?? 0

  return (
    <>
      {/* Brand + Category */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {brandName && (
          <span className="rounded-full bg-muted px-2.5 py-1 text-foreground">
            {brandName}
          </span>
        )}
        {categoryNames && <span>{categoryNames}</span>}
      </div>

      {/* Product name */}
      <h1 className="text-2xl font-bold leading-snug text-foreground md:text-3xl">
        {product.name}
      </h1>

      {/* Rating + sold count */}
      <div className="flex flex-wrap items-center gap-3">
        <RatingStars rating={avgRating} reviewCount={reviewCount} />
        {totalSold > 0 && (
          <span className="text-xs text-muted-foreground">
            | Đã bán <span className="font-semibold">{totalSold}</span>
          </span>
        )}
      </div>
    </>
  )
}
