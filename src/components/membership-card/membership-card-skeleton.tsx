import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton component for MembershipCard while loading user data
 */
export function MembershipCardSkeleton() {
  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* User Info + Barcode Skeleton */}
      <div className="gap-3">
        {/* Avatar + Name Skeleton */}
        <div className="relative flex shrink-0 items-center justify-center gap-x-5">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Barcode Skeleton */}
        <div className="mx-auto mt-1 w-fit">
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      {/* Phone + Points Skeleton */}
      <div className="mt-3 flex items-center justify-between text-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Membership Tier Card Skeleton */}
      <div className="mt-4 rounded-lg bg-muted p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20 bg-muted-foreground/20" />
            <Skeleton className="h-4 w-1 bg-muted-foreground/20" />
            <Skeleton className="h-5 w-24 bg-muted-foreground/20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full bg-muted-foreground/20" />
        </div>

        <Skeleton className="mt-2 h-4 w-3/4 bg-muted-foreground/20" />

        <Skeleton className="mt-3 h-5 w-40 bg-muted-foreground/20" />
      </div>
    </div>
  );
}
