import { getProductsAPI } from '@/lib/apis/server/product-apis';
import { getProductStatsAPI } from '@/lib/apis/server/product-apis';
import { PRODUCTS_PER_PAGE } from '@/components/product-listing/constants';
import { ProductsBanner } from '@/app/(main)/products/components/products-banner';
import { ProductsInfo } from '@/app/(main)/products/components/products-info';
import { AllProducts } from '@/app/(main)/products/components/all-products';
import { getQueryClient } from '@/lib/query-client/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { formatCount } from '@/lib/utils';
import { connection } from 'next/server';
import { getProductListingQueryKey } from '@/hooks/querys/product-listing.query';
import { notFound } from 'next/navigation';

interface ProductsShieldProps {
  page: number;
}

/**
 * Server Component that pre-fetches products for the given page + stats for SEO.
 * Product data is included in the HTML on first render, then React Query takes over.
 */
export async function ProductsShield({ page }: ProductsShieldProps) {
  await connection();

  const queryClient = getQueryClient();

  const initialParams = { page, limit: PRODUCTS_PER_PAGE };

  // Prefetch products for the current page & stats in parallel
  const [, statsResponse] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: getProductListingQueryKey(initialParams),
      queryFn: () => getProductsAPI(initialParams),
    }),
    getProductStatsAPI({}),
  ]);

  // Validate page is within range
  const productsData = queryClient.getQueryData<
    Awaited<ReturnType<typeof getProductsAPI>>
  >(getProductListingQueryKey(initialParams));

  if (productsData && page > 1 && productsData.data.totalPage < page) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6 py-4 md:py-6 container">
        <ProductsBanner />
        <ProductsInfo
          productCount={statsResponse.data?.productCount ?? 0}
          purchaseCount={formatCount(statsResponse.data?.totalSold ?? 0)}
        />

        {/* Products Section — SSR initial data, client takes over for filter/sort/pagination */}
        <AllProducts initialPage={page} />
      </div>
    </HydrationBoundary>
  );
}
