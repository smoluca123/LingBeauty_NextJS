import { NextResponse } from 'next/server';
import { getAggregatedStatsAPI } from '@/lib/apis/server/admin-stats-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IAggregatedStats,
  StatsPeriod,
} from '@/lib/types/interfaces/apis/stats.interfaces';

/**
 * GET /api/stats/aggregated?period=month&startDate=&endDate=
 */
export async function GET(
  request: Request,
): Promise<
  NextResponse<
    IApiResponseWrapperType<IAggregatedStats[]> | { message: string }
  >
> {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as StatsPeriod | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const response = await getAggregatedStatsAPI(
      period ?? undefined,
      startDate ?? undefined,
      endDate ?? undefined,
    );
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to fetch aggregated stats';
    return NextResponse.json({ message }, { status: 500 });
  }
}
