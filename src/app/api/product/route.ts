import {
  getProductsAPI,
  type IProductQueryParams,
} from '@/lib/apis/server/product-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const params: IProductQueryParams = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    search: searchParams.get('search') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    brandId: searchParams.get('brandId') ?? undefined,
    isFeatured: searchParams.has('isFeatured')
      ? searchParams.get('isFeatured') === 'true'
      : undefined,
    minPrice: searchParams.has('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.has('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
    sortBy:
      (searchParams.get('sortBy') as IProductQueryParams['sortBy']) ??
      undefined,
    order:
      (searchParams.get('order') as IProductQueryParams['order']) ?? undefined,
  };

  return proxyRoute(() => getProductsAPI(params));
};
