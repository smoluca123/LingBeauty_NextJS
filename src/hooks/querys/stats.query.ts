import {
  getAggregatedStatsClientAPI,
  getDailyStatsClientAPI,
  getOrderStatusBreakdownClientAPI,
  getOverviewStatsClientAPI,
  getRevenueChartClientAPI,
  getTopProductsClientAPI,
  type IAggregatedStatsClientParams,
  type IDailyStatsClientParams,
  type IRevenueChartClientParams,
  type ITopProductsClientParams,
} from '@/lib/apis/client/stats.apis'
import { useQuery } from '@tanstack/react-query'

// ── Query keys ────────────────────────────────────────────────────────────────

export const statsQueryKeys = {
  overview: ['stats', 'overview'] as const,
  daily: (params: IDailyStatsClientParams) =>
    ['stats', 'daily', params] as const,
  aggregated: (params: IAggregatedStatsClientParams) =>
    ['stats', 'aggregated', params] as const,
  revenueChart: (params: IRevenueChartClientParams) =>
    ['stats', 'revenue-chart', params] as const,
  orderBreakdown: ['stats', 'orders', 'breakdown'] as const,
  topProducts: (params: ITopProductsClientParams) =>
    ['stats', 'products', 'top', params] as const,
}

// ── Overview ─────────────────────────────────────────────────────────────────

export const useOverviewStatsQuery = () =>
  useQuery({
    queryKey: statsQueryKeys.overview,
    queryFn: () => getOverviewStatsClientAPI(),
    staleTime: 1000 * 60 * 2, // 2 phút
  })

// ── Daily snapshots ───────────────────────────────────────────────────────────

export const useDailyStatsQuery = (params: IDailyStatsClientParams = {}) =>
  useQuery({
    queryKey: statsQueryKeys.daily(params),
    queryFn: () => getDailyStatsClientAPI(params),
    staleTime: 1000 * 60 * 2,
  })

// ── Aggregated stats ──────────────────────────────────────────────────────────

export const useAggregatedStatsQuery = (
  params: IAggregatedStatsClientParams = {},
) =>
  useQuery({
    queryKey: statsQueryKeys.aggregated(params),
    queryFn: () => getAggregatedStatsClientAPI(params),
    staleTime: 1000 * 60 * 2,
  })

// ── Revenue chart ─────────────────────────────────────────────────────────────

export const useRevenueChartQuery = (params: IRevenueChartClientParams = {}) =>
  useQuery({
    queryKey: statsQueryKeys.revenueChart(params),
    queryFn: () => getRevenueChartClientAPI(params),
    staleTime: 1000 * 60 * 2,
  })

// ── Order status breakdown ────────────────────────────────────────────────────

export const useOrderStatusBreakdownQuery = () =>
  useQuery({
    queryKey: statsQueryKeys.orderBreakdown,
    queryFn: () => getOrderStatusBreakdownClientAPI(),
    staleTime: 1000 * 60 * 2,
  })

// ── Top products ──────────────────────────────────────────────────────────────

export const useTopProductsQuery = (params: ITopProductsClientParams = {}) =>
  useQuery({
    queryKey: statsQueryKeys.topProducts(params),
    queryFn: () => getTopProductsClientAPI(params),
    staleTime: 1000 * 60 * 2,
  })
