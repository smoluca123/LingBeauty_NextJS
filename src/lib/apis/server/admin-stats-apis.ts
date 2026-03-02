'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import {
  IAggregatedStats,
  IDailyStats,
  IOrderStatusBreakdown,
  IOverviewStats,
  IRevenueChart,
  ITopProduct,
  StatsPeriod,
} from '@/lib/types/interfaces/apis/stats.interfaces';

// ── Overview ──────────────────────────────────────────────────────────────────

export const getOverviewStatsAPI = async (): Promise<
  IApiResponseWrapperType<IOverviewStats>
> => {
  try {
    return await kyInstance
      .get('stats/overview')
      .json<IApiResponseWrapperType<IOverviewStats>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch overview stats');
    }
    throw error;
  }
};

// ── Revenue chart ─────────────────────────────────────────────────────────────

export const getRevenueChartAPI = async (
  period?: StatsPeriod,
  startDate?: string,
  endDate?: string,
): Promise<IApiResponseWrapperType<IRevenueChart>> => {
  try {
    const searchParams: Record<string, string> = {};
    if (period) searchParams.period = period;
    if (startDate) searchParams.startDate = startDate;
    if (endDate) searchParams.endDate = endDate;

    return await kyInstance
      .get('stats/revenue-chart', { searchParams })
      .json<IApiResponseWrapperType<IRevenueChart>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch revenue chart');
    }
    throw error;
  }
};

// ── Order status breakdown ────────────────────────────────────────────────────

export const getOrderStatusBreakdownAPI = async (): Promise<
  IApiResponseWrapperType<IOrderStatusBreakdown>
> => {
  try {
    return await kyInstance
      .get('stats/orders/breakdown')
      .json<IApiResponseWrapperType<IOrderStatusBreakdown>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw new Error(
        errorData.message || 'Failed to fetch order status breakdown',
      );
    }
    throw error;
  }
};

// ── Top products ──────────────────────────────────────────────────────────────

export const getTopProductsAPI = async (
  limit = 5,
): Promise<IApiResponseWrapperType<ITopProduct[]>> => {
  try {
    return await kyInstance
      .get('stats/products/top', { searchParams: { limit: String(limit) } })
      .json<IApiResponseWrapperType<ITopProduct[]>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch top products');
    }
    throw error;
  }
};

// ── Daily stats ───────────────────────────────────────────────────────────────

export const getDailyStatsAPI = async (
  startDate?: string,
  endDate?: string,
): Promise<IApiResponseWrapperType<IDailyStats[]>> => {
  try {
    const searchParams: Record<string, string> = {};
    if (startDate) searchParams.startDate = startDate;
    if (endDate) searchParams.endDate = endDate;

    return await kyInstance
      .get('stats/daily', { searchParams })
      .json<IApiResponseWrapperType<IDailyStats[]>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch daily stats');
    }
    throw error;
  }
};

// ── Aggregated stats ──────────────────────────────────────────────────────────

export const getAggregatedStatsAPI = async (
  period?: StatsPeriod,
  startDate?: string,
  endDate?: string,
): Promise<IApiResponseWrapperType<IAggregatedStats[]>> => {
  try {
    const searchParams: Record<string, string> = {};
    if (period) searchParams.period = period;
    if (startDate) searchParams.startDate = startDate;
    if (endDate) searchParams.endDate = endDate;

    return await kyInstance
      .get('stats/aggregated', { searchParams })
      .json<IApiResponseWrapperType<IAggregatedStats[]>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch aggregated stats');
    }
    throw error;
  }
};

// ── Sync daily stats ──────────────────────────────────────────────────────────

export const syncDailyStatsAPI = async (): Promise<
  IApiResponseWrapperType<{ message: string }>
> => {
  try {
    return await kyInstance
      .post('stats/sync')
      .json<IApiResponseWrapperType<{ message: string }>>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to sync daily stats');
    }
    throw error;
  }
};

