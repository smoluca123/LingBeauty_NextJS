import { BrandList } from '@/components/home/brands/brand-list';
import { getBrandsQueryKey } from '@/hooks/querys/brand.query';
import { getBrandsAPI } from '@/lib/apis/server/brand-apis';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

export async function BrandListSection() {
  const queryClient = new QueryClient();
  const initialData = await getBrandsAPI({ page: 1, limit: 20 });
  await queryClient.prefetchInfiniteQuery({
    queryKey: getBrandsQueryKey,
    queryFn: ({ pageParam }) => getBrandsAPI({ page: pageParam, limit: 20 }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandList initialData={initialData.data.items} />
    </HydrationBoundary>
  );
}
