import {
  getProductStatsAPI,
  type IProductStatsQueryParams,
} from '@/lib/apis/server/product-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const params: IProductStatsQueryParams = {
    brandId: searchParams.get('brandId') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    isFeatured: searchParams.has('isFeatured')
      ? searchParams.get('isFeatured') === 'true'
      : undefined,
  };

  return proxyRoute(() => getProductStatsAPI(params));
};
