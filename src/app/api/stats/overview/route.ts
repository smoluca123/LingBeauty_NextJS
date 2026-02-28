import { NextResponse } from 'next/server';
import { getOverviewStatsAPI } from '@/lib/apis/server/admin-stats-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IOverviewStats } from '@/lib/types/interfaces/apis/stats.interfaces';

/**
 * GET /api/stats/overview
 */
export async function GET(): Promise<
  NextResponse<IApiResponseWrapperType<IOverviewStats> | { message: string }>
> {
  try {
    const response = await getOverviewStatsAPI();
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch overview stats';
    return NextResponse.json({ message }, { status: 500 });
  }
}
