import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/style-utils'
import { IPropsWithClassName } from '@/lib/types/interfaces/utils.interfaces'

/**
 * Skeleton loading state for ProductCard2 component
 * Matches the layout structure of ProductCard2 for consistent UI
 */
export function ProductCard2Skeleton({ className }: IPropsWithClassName) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border bg-card p-4 shadow-sm',
        className,
      )}
    >
      {/* Product Header - Discount Badge Area */}
      <div className="mb-3 flex justify-end">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Product Image Carousel */}
      <Skeleton className="aspect-square w-full rounded-xl" />

      {/* Product Badges */}
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      {/* Product Info - Brand and Name */}
      <div className="mt-3 space-y-2 flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* Rating and Stats Section */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Product Price */}
      <div className="mt-3 flex items-center gap-2">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Variant Selector */}
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>

      {/* Action Button */}
      <Skeleton className="mt-4 h-10 w-full rounded-full" />
    </article>
  )
}
