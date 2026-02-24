import {
  getProductStatsAPI,
  IProductStatsQueryParams,
} from '@/lib/apis/server/product-apis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const params: IProductStatsQueryParams = {
    brandId: searchParams.get('brandId') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    isFeatured: searchParams.has('isFeatured')
      ? searchParams.get('isFeatured') === 'true'
      : undefined,
  };

  const data = await getProductStatsAPI(params);
  return NextResponse.json(data);
}
