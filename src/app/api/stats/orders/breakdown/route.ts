import { NextResponse } from 'next/server';
import { getOrderStatusBreakdownAPI } from '@/lib/apis/server/admin-stats-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IOrderStatusBreakdown } from '@/lib/types/interfaces/apis/stats.interfaces';

/**
 * GET /api/stats/orders/breakdown
 */
export async function GET(): Promise<
  NextResponse<
    IApiResponseWrapperType<IOrderStatusBreakdown> | { message: string }
  >
> {
  try {
    const response = await getOrderStatusBreakdownAPI();
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch order status breakdown';
    return NextResponse.json({ message }, { status: 500 });
  }
}
