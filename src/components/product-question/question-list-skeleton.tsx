import { Skeleton } from '@/components/ui/skeleton';

export function QuestionListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Question */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Answer (50% chance) */}
          {i % 2 === 0 && (
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-full ml-8" />
              <Skeleton className="h-4 w-2/3 ml-8" />
              <Skeleton className="h-3 w-20 ml-8" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
