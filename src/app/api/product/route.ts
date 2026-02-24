import {
  getProductsAPI,
  IProductQueryParams,
} from '@/lib/apis/server/product-apis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

  const data = await getProductsAPI(params);
  return NextResponse.json(data);
}
