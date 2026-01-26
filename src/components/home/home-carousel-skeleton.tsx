import { Skeleton } from '@/components/ui/skeleton';

export function HomeCarouselSkeleton() {
  return (
    <section aria-label="Loading banner" className="w-full">
      <div className="flex flex-col gap-3 md:gap-4 lg:flex-row">
        {/* Main carousel skeleton */}
        <div className="relative flex-1 overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="h-[280px] sm:h-80 md:h-[360px] bg-linear-to-br from-gray-100 via-gray-50 to-white px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
            <div className="flex h-full flex-col justify-between gap-3 md:gap-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>

              {/* Title and description */}
              <div>
                <Skeleton className="h-10 w-full max-w-md mb-2" />
                <Skeleton className="h-4 w-full max-w-sm" />
                <Skeleton className="h-4 w-3/4 max-w-xs mt-1" />
              </div>

              {/* CTA button */}
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-11 w-32 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>

          {/* Controls skeleton */}
          <div className="absolute inset-0 z-10 flex items-end justify-between p-3 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-1.5 w-5 rounded-full" />
              <Skeleton className="h-1.5 w-2 rounded-full" />
              <Skeleton className="h-1.5 w-2 rounded-full" />
            </div>
          </div>
        </div>

        {/* Side banners skeleton */}
        <div className="flex w-full flex-row gap-3 md:gap-4 lg:w-md lg:flex-col">
          <div className="flex-1 rounded-xl border bg-linear-to-br from-gray-100 to-white p-4 sm:p-5 shadow-sm">
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex-1 rounded-xl border bg-linear-to-br from-gray-100 to-white p-4 sm:p-5 shadow-sm">
            <Skeleton className="h-3 w-32 mb-2" />
            <Skeleton className="h-5 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </section>
  );
}
