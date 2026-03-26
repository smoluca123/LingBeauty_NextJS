import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { extractErrorMessage } from '@/lib/utils/error-handler'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IAggregatedStatsType,
  IDailyStatsType,
  IOrderStatusBreakdownType,
  IOverviewStatsType,
  IRevenueChartType,
  ITopProductType,
  StatsPeriod,
} from '@/lib/types/interfaces/apis/stats.interfaces'

// Helper: loại bỏ undefined trước khi truyền vào searchParams
const buildSearchParams = (
  options: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean> =>
  Object.fromEntries(
    Object.entries(options).filter(([, v]) => v !== undefined),
  ) as Record<string, string | number | boolean>

// ── Overview ─────────────────────────────────────────────────────────────────

/**
 * Get overview statistics
 * @returns Promise with overview stats data
 * @throws Error with backend message
 */
export const getOverviewStatsClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/stats/overview')
      .json<IApiResponseWrapperType<IOverviewStatsType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch overview stats'),
    )
  }
}

// ── Daily snapshots ───────────────────────────────────────────────────────────

export interface IDailyStatsClientParams {
  startDate?: string
  endDate?: string
}

/**
 * Get daily statistics snapshots
 * @param params - Date range parameters
 * @returns Promise with daily stats array
 * @throws Error with backend message
 */
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
      .json<IApiResponseWrapperType<IDailyStatsType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch daily stats'),
    )
  }
}

// ── Aggregated stats ──────────────────────────────────────────────────────────

export interface IAggregatedStatsClientParams {
  period?: StatsPeriod
  startDate?: string
  endDate?: string
}

/**
 * Get aggregated statistics
 * @param params - Period and date range parameters
 * @returns Promise with aggregated stats array
 * @throws Error with backend message
 */
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
      .json<IApiResponseWrapperType<IAggregatedStatsType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch aggregated stats'),
    )
  }
}

// ── Revenue chart ─────────────────────────────────────────────────────────────

export interface IRevenueChartClientParams {
  period?: StatsPeriod
  startDate?: string
  endDate?: string
}

/**
 * Get revenue chart data
 * @param params - Period and date range parameters
 * @returns Promise with revenue chart data
 * @throws Error with backend message
 */
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
      .json<IApiResponseWrapperType<IRevenueChartType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch revenue chart'),
    )
  }
}

// ── Order status breakdown ────────────────────────────────────────────────────

/**
 * Get order status breakdown
 * @returns Promise with order status breakdown data
 * @throws Error with backend message
 */
export const getOrderStatusBreakdownClientAPI = async () => {
  try {
    return await kyNextInstance
      .get('admin/stats/orders/breakdown')
      .json<IApiResponseWrapperType<IOrderStatusBreakdownType>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(
        error,
        'Failed to fetch order status breakdown',
      ),
    )
  }
}

// ── Top products ──────────────────────────────────────────────────────────────

export interface ITopProductsClientParams {
  limit?: number
}

/**
 * Get top products
 * @param params - Limit parameter
 * @returns Promise with top products array
 * @throws Error with backend message
 */
export const getTopProductsClientAPI = async (
  params: ITopProductsClientParams = {},
) => {
  try {
    return await kyNextInstance
      .get('admin/stats/products/top', {
        searchParams: buildSearchParams({ limit: params.limit }),
      })
      .json<IApiResponseWrapperType<ITopProductType[]>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to fetch top products'),
    )
  }
}

// ── Sync daily stats ──────────────────────────────────────────────────────────

/**
 * Sync daily statistics
 * @returns Promise with sync result message
 * @throws Error with backend message
 */
export const syncDailyStatsClientAPI = async () => {
  try {
    return await kyNextInstance
      .post('admin/stats/sync')
      .json<IApiResponseWrapperType<{ message: string }>>()
  } catch (error) {
    throw new Error(
      await extractErrorMessage(error, 'Failed to sync daily stats'),
    )
  }
}
