import { Suspense } from 'react';
import { BrandList } from '@/components/home/brands/brand-list';
import { BrandListSkeleton } from './brand-list-skeleton';
import { getBrandsQueryKey } from '@/hooks/querys/brand.query';
import { getBrandsAPI } from '@/lib/apis/server/brand-apis';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

export async function BrandListSection() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: getBrandsQueryKey,
    queryFn: ({ pageParam }) => getBrandsAPI({ page: pageParam, limit: 20 }),
    initialPageParam: 1,
  });

  return (
    <Suspense fallback={<BrandListSkeleton />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BrandList />
      </HydrationBoundary>
    </Suspense>
  );
}
