import { NextResponse } from 'next/server';
import { getDailyStatsAPI } from '@/lib/apis/server/admin-stats-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IDailyStats } from '@/lib/types/interfaces/apis/stats.interfaces';

/**
 * GET /api/stats/daily?startDate=&endDate=
 */
export async function GET(
  request: Request,
): Promise<
  NextResponse<IApiResponseWrapperType<IDailyStats[]> | { message: string }>
> {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const response = await getDailyStatsAPI(
      startDate ?? undefined,
      endDate ?? undefined,
    );
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch daily stats';
    return NextResponse.json({ message }, { status: 500 });
  }
}
