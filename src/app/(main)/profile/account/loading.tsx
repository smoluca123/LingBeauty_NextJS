import { Skeleton } from '@/components/ui/skeleton';
import { FormSkeleton } from '@/components/skeletons/form-skeleton';

/**
 * Loading state for Account page
 * Shows while fetching user data from server
 */
export default function AccountLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title Skeleton */}
      <Skeleton className="h-8 w-32" />

      {/* Form Skeleton - 2 rows x 2 columns matching AccountForm */}
      <FormSkeleton rows={2} columns={2} />
    </div>
  );
}
