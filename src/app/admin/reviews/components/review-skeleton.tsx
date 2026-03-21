'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ReviewCardSkeleton() {
  return (
    <div className='bg-white rounded-xl border border-gray-200 p-5'>
      {/* Header */}
      <div className='flex items-start justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-1.5'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-3 w-40' />
          </div>
        </div>
        <Skeleton className='h-6 w-20 rounded-full' />
      </div>

      {/* Product Info */}
      <div className='mb-3 p-3 bg-gray-50 rounded-lg'>
        <Skeleton className='h-3 w-16 mb-1' />
        <Skeleton className='h-4 w-full' />
      </div>

      {/* Rating */}
      <div className='flex items-center gap-2 mb-3'>
        <Skeleton className='h-6 w-12 rounded-lg' />
        <div className='flex gap-0.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-3 w-3 rounded-full' />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='mb-4 space-y-2'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-2/3' />
      </div>

      {/* Images */}
      <div className='flex gap-2 mb-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-16 w-16 rounded-lg' />
        ))}
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
        <div className='flex gap-4'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-20' />
        </div>
        <Skeleton className='h-3 w-24' />
      </div>
    </div>
  );
}

export function ReviewGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
      {Array.from({ length: count }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReviewInfiniteLoader() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
      {Array.from({ length: 3 }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}
