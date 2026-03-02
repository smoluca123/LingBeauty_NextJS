import { NextResponse } from 'next/server';
import { syncDailyStatsAPI } from '@/lib/apis/server/admin-stats-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';

/**
 * POST /api/stats/sync
 */
export async function POST(): Promise<
  NextResponse<
    IApiResponseWrapperType<{ message: string }> | { message: string }
  >
> {
  try {
    const response = await syncDailyStatsAPI();
    return NextResponse.json(response);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to sync daily stats';
    return NextResponse.json({ message }, { status: 500 });
  }
}
