import { Skeleton } from '@/components/ui/skeleton';

interface FormSkeletonProps {
  rows?: number;
  columns?: 1 | 2;
}

/**
 * Reusable skeleton component for form loading states
 * Shows animated placeholders matching form field layout
 */
export function FormSkeleton({ rows = 2, columns = 2 }: FormSkeletonProps) {
  return (
    <div className="space-y-6">
      <div
        className={`grid grid-cols-1 gap-6 ${columns === 2 ? 'md:grid-cols-2' : ''}`}
      >
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-11 w-32 rounded-full" />
      </div>
    </div>
  );
}
