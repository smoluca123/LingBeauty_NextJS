import { TopProducts } from '@/components/home/products/top-products-section/top-products';
import { getProductsAPI } from '@/lib/apis/server/product-apis';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export async function TopProductsSection() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['products', 'top-products'],
    queryFn: ({ pageParam }) => getProductsAPI({ page: pageParam }),
    initialPageParam: 1,
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TopProducts />
      </HydrationBoundary>
    </>
  );
}
