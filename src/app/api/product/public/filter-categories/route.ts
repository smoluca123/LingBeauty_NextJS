import {
  getFilterCategoriesAPI,
  type IFilterCategoriesQueryParams,
} from '@/lib/apis/server/product-apis';
import { proxyRoute } from '@/lib/proxy-route';

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url);

  const params: IFilterCategoriesQueryParams = {
    brandId: searchParams.get('brandId') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    isFeatured: searchParams.has('isFeatured')
      ? searchParams.get('isFeatured') === 'true'
      : undefined,
    minPrice: searchParams.has('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.has('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
  };

  return proxyRoute(() => getFilterCategoriesAPI(params));
};
