import { NextResponse } from 'next/server';
import { getTopProductsAPI } from '@/lib/apis/server/admin-stats-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { ITopProduct } from '@/lib/types/interfaces/apis/stats.interfaces';

/**
 * GET /api/stats/products/top?limit=5
 */
export async function GET(
  request: Request,
): Promise<
  NextResponse<IApiResponseWrapperType<ITopProduct[]> | { message: string }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const response = await getTopProductsAPI(limit ? Number(limit) : 5);
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch top products';
    return NextResponse.json({ message }, { status: 500 });
  }
}
