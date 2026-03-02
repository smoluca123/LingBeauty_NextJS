import { kyNextInstance } from '@/lib/kyInstance/kyNext';
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
import { HTTPError } from 'ky';

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>;

const handleError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const data = await error.response.json().catch(() => ({}));
    throw new Error((data as { message?: string }).message || error.message);
  }
  throw error;
};

// ── Overview ─────────────────────────────────────────────────────────────────

export const getOverviewStatsClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/stats/overview')
      .json<IApiResponseWrapperType<IOverviewStatsType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Daily snapshots ───────────────────────────────────────────────────────────

export interface IDailyStatsClientParams {
  startDate?: string;
  endDate?: string;
}

export const getDailyStatsClientAPI = async (
  params: IDailyStatsClientParams = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/stats/daily', {
        searchParams: buildSearchParams({
          startDate: params.startDate,
          endDate: params.endDate,
        }),
      })
      .json<IApiResponseWrapperType<IDailyStatsType[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Aggregated stats ──────────────────────────────────────────────────────────

export interface IAggregatedStatsClientParams {
  period?: StatsPeriod;
  startDate?: string;
  endDate?: string;
}

export const getAggregatedStatsClientAPI = async (
  params: IAggregatedStatsClientParams = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/stats/aggregated', {
        searchParams: buildSearchParams({
          period: params.period,
          startDate: params.startDate,
          endDate: params.endDate,
        }),
      })
      .json<IApiResponseWrapperType<IAggregatedStatsType[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Revenue chart ─────────────────────────────────────────────────────────────

export interface IRevenueChartClientParams {
  period?: StatsPeriod;
  startDate?: string;
  endDate?: string;
}

export const getRevenueChartClientAPI = async (
  params: IRevenueChartClientParams = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/stats/revenue-chart', {
        searchParams: buildSearchParams({
          period: params.period,
          startDate: params.startDate,
          endDate: params.endDate,
        }),
      })
      .json<IApiResponseWrapperType<IRevenueChartType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Order status breakdown ────────────────────────────────────────────────────

export const getOrderStatusBreakdownClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/stats/orders/breakdown')
      .json<IApiResponseWrapperType<IOrderStatusBreakdownType>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Top products ──────────────────────────────────────────────────────────────

export interface ITopProductsClientParams {
  limit?: number;
}

export const getTopProductsClientAPI = async (
  params: ITopProductsClientParams = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/stats/products/top', {
        searchParams: buildSearchParams({ limit: params.limit }),
      })
      .json<IApiResponseWrapperType<ITopProductType[]>>();
  } catch (error) {
    return handleError(error);
  }
};

// ── Sync daily stats ──────────────────────────────────────────────────────────

export const syncDailyStatsClientAPI = async () => {
  try {
    return await kyNextInstance
      .post('admin/stats/sync')
      .json<IApiResponseWrapperType<{ message: string }>>();
  } catch (error) {
    return handleError(error);
  }
};
