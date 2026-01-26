import { Skeleton } from '@/components/ui/skeleton';

export function FlashSaleSectionSkeleton() {
  return (
    <section className="w-full">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-32" />
            {/* Timer skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-12 rounded-md" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-8 w-12 rounded-md" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-8 w-12 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Products grid skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group">
              <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all">
                {/* Image skeleton */}
                <div className="relative aspect-square bg-muted">
                  <Skeleton className="h-full w-full" />
                  {/* Badge skeleton */}
                  <div className="absolute left-2 top-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />

                  {/* Price skeleton */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>

                  {/* Progress skeleton */}
                  <div className="space-y-1">
                    <Skeleton className="h-2 w-full rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
