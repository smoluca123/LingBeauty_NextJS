import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard2Skeleton } from '@/components/product/product-card2-skeleton';
import { PRODUCTS_PER_PAGE } from '@/components/product-listing/constants';

export default function ProductsListingPageSkeleton() {
  return (
    <div className="space-y-6 py-4 md:py-6 container">
      {/* Banner Skeleton */}
      <Skeleton className="w-full h-50 sm:h-70 md:h-85 lg:h-100 rounded-2xl" />

      {/* Info / Stats Skeleton */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="mx-auto h-9 w-64 mb-4" />
          <div className="flex items-center justify-center gap-4 sm:gap-6 max-w-md mx-auto">
            <Skeleton className="flex-1 h-24 rounded-2xl" />
            <Skeleton className="flex-1 h-24 rounded-2xl" />
          </div>
        </div>
      </section>

      {/* Product Listing Skeleton */}
      <div className="flex gap-6 lg:gap-8">
        {/* Filter Sidebar Skeleton */}
        <div className="hidden shrink-0 md:block md:w-52 lg:w-60 space-y-6">
          {/* Search */}
          <Skeleton className="h-10 w-full rounded-lg" />

          {/* Filter groups */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Products Grid Skeleton */}
        <div className="min-w-0 flex-1">
          {/* Header: results count + sort */}
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-36 rounded-lg" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
              <ProductCard2Skeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
