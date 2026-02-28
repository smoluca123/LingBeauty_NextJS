import { NextResponse } from 'next/server';
import { getRevenueChartAPI } from '@/lib/apis/server/admin-stats-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IRevenueChart,
  StatsPeriod,
} from '@/lib/types/interfaces/apis/stats.interfaces';

/**
 * GET /api/stats/revenue-chart?period=month&startDate=&endDate=
 */
export async function GET(
  request: Request,
): Promise<
  NextResponse<IApiResponseWrapperType<IRevenueChart> | { message: string }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as StatsPeriod | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const response = await getRevenueChartAPI(
      period ?? undefined,
      startDate ?? undefined,
      endDate ?? undefined,
    );
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch revenue chart';
    return NextResponse.json({ message }, { status: 500 });
  }
}
