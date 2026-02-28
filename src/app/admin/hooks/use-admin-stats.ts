'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getOverviewStatsClientAPI,
  getRevenueChartClientAPI,
  getOrderStatusBreakdownClientAPI,
  getTopProductsClientAPI,
  IRevenueChartParams,
} from '@/lib/apis/client/actions/admin-stats.actions';

export const ADMIN_STATS_QUERY_KEY = ['admin', 'stats'] as const;

export function useOverviewStats() {
  return useQuery({
    queryKey: [...ADMIN_STATS_QUERY_KEY, 'overview'],
    queryFn: getOverviewStatsClientAPI,
    staleTime: 60_000, // 1 phút
  });
}

export function useRevenueChart(params: IRevenueChartParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_STATS_QUERY_KEY, 'revenue-chart', params],
    queryFn: () => getRevenueChartClientAPI(params),
    staleTime: 60_000,
  });
}

export function useOrderStatusBreakdown() {
  return useQuery({
    queryKey: [...ADMIN_STATS_QUERY_KEY, 'orders-breakdown'],
    queryFn: getOrderStatusBreakdownClientAPI,
    staleTime: 60_000,
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: [...ADMIN_STATS_QUERY_KEY, 'top-products', limit],
    queryFn: () => getTopProductsClientAPI(limit),
    staleTime: 60_000,
  });
}
