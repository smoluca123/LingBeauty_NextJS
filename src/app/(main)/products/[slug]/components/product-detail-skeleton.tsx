import { cn } from '@/lib/utils/style-utils'

// Reusable skeleton block
function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-muted', className)} />
}

export function ProductDetailSkeleton() {
  return (
    <div className="container py-6 md:py-10">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <SkeletonBlock className="h-4 w-16" />
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-4 w-32" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery skeleton */}
        <div className="space-y-3">
          <SkeletonBlock className="aspect-square w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-16 w-16 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-6 w-2/4" />
          <div className="flex gap-2">
            <SkeletonBlock className="h-6 w-16 rounded-full" />
            <SkeletonBlock className="h-6 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-10 w-32" />
            <SkeletonBlock className="h-5 w-20" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <SkeletonBlock className="h-12 w-full rounded-full" />
          <SkeletonBlock className="h-12 w-full rounded-full" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-10 space-y-4">
        <div className="flex gap-4 border-b">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-10 w-24" />
          ))}
        </div>
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
          <SkeletonBlock className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  )
}
