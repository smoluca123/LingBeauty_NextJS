'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type {
  IAggregatedStatsType,
  IDailyStatsType,
  IOrderStatusBreakdownType,
  IOverviewStatsType,
  IRevenueChartType,
  ITopProductType,
  StatsPeriod,
} from '@/lib/types/interfaces/apis/stats.interfaces';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

// ── Overview ─────────────────────────────────────────────────────────────────

export const getOverviewStatsAPI = async () =>
  kyInstance
    .get('stats/overview')
    .json<IApiResponseWrapperType<IOverviewStatsType>>();

// ── Daily snapshots ───────────────────────────────────────────────────────────

export interface IDailyStatsParams {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

export const getDailyStatsAPI = async (params: IDailyStatsParams = {}) =>
  kyInstance
    .get('stats/daily', {
      searchParams: buildSearchParams({
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    })
    .json<IApiResponseWrapperType<IDailyStatsType[]>>();

// ── Aggregated stats (week / month / year) ────────────────────────────────────

export interface IAggregatedStatsParams {
  period?: StatsPeriod;
  startDate?: string;
  endDate?: string;
}

export const getAggregatedStatsAPI = async (
  params: IAggregatedStatsParams = {},
) =>
  kyInstance
    .get('stats/aggregated', {
      searchParams: buildSearchParams({
        period: params.period,
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    })
    .json<IApiResponseWrapperType<IAggregatedStatsType[]>>();

// ── Revenue chart ─────────────────────────────────────────────────────────────

export interface IRevenueChartParams {
  period?: StatsPeriod;
  startDate?: string;
  endDate?: string;
}

export const getRevenueChartAPI = async (params: IRevenueChartParams = {}) =>
  kyInstance
    .get('stats/revenue-chart', {
      searchParams: buildSearchParams({
        period: params.period,
        startDate: params.startDate,
        endDate: params.endDate,
      }),
    })
    .json<IApiResponseWrapperType<IRevenueChartType>>();

// ── Order status breakdown ────────────────────────────────────────────────────

export const getOrderStatusBreakdownAPI = async () =>
  kyInstance
    .get('stats/orders/breakdown')
    .json<IApiResponseWrapperType<IOrderStatusBreakdownType>>();

// ── Top products ──────────────────────────────────────────────────────────────

export interface ITopProductsParams {
  limit?: number;
}

export const getTopProductsAPI = async (params: ITopProductsParams = {}) =>
  kyInstance
    .get('stats/products/top', {
      searchParams: buildSearchParams({
        limit: params.limit,
      }),
    })
    .json<IApiResponseWrapperType<ITopProductType[]>>();

// ── Sync daily stats ──────────────────────────────────────────────────────────

export const syncDailyStatsAPI = async () =>
  kyInstance
    .post('stats/sync')
    .json<IApiResponseWrapperType<{ message: string }>>();
