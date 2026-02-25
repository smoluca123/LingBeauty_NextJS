import {
  getFilterCategoriesAPI,
  IFilterCategoriesQueryParams,
} from '@/lib/apis/server/product-apis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

  const data = await getFilterCategoriesAPI(params);
  return NextResponse.json(data);
}
