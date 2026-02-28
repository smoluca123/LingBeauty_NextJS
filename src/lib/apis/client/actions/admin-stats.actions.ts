'use client';

import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import {
  IOrderStatusBreakdown,
  IOverviewStats,
  IRevenueChart,
  ITopProduct,
  StatsPeriod,
} from '@/lib/types/interfaces/apis/stats.interfaces';
import { HTTPError } from 'ky';

export interface IRevenueChartParams {
  period?: StatsPeriod;
  startDate?: string;
  endDate?: string;
}

// ── Overview ──────────────────────────────────────────────────────────────────

export const getOverviewStatsClientAPI = async (): Promise<
  IApiResponseWrapperType<IOverviewStats>
> => {
  try {
    return await kyNextInstance
      .get('stats/overview')
      .json<IApiResponseWrapperType<IOverviewStats>>();
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch overview stats');
    }
    throw error;
  }
};

// ── Revenue chart ─────────────────────────────────────────────────────────────

export const getRevenueChartClientAPI = async (
  params: IRevenueChartParams = {},
): Promise<IApiResponseWrapperType<IRevenueChart>> => {
  try {
    const searchParams: Record<string, string> = {};
    if (params.period) searchParams.period = params.period;
    if (params.startDate) searchParams.startDate = params.startDate;
    if (params.endDate) searchParams.endDate = params.endDate;

    return await kyNextInstance
      .get('stats/revenue-chart', { searchParams })
      .json<IApiResponseWrapperType<IRevenueChart>>();
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch revenue chart');
    }
    throw error;
  }
};

// ── Order status breakdown ────────────────────────────────────────────────────

export const getOrderStatusBreakdownClientAPI = async (): Promise<
  IApiResponseWrapperType<IOrderStatusBreakdown>
> => {
  try {
    return await kyNextInstance
      .get('stats/orders/breakdown')
      .json<IApiResponseWrapperType<IOrderStatusBreakdown>>();
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(
        errorData.message || 'Failed to fetch order status breakdown',
      );
    }
    throw error;
  }
};

// ── Top products ──────────────────────────────────────────────────────────────

export const getTopProductsClientAPI = async (
  limit = 5,
): Promise<IApiResponseWrapperType<ITopProduct[]>> => {
  try {
    return await kyNextInstance
      .get('stats/products/top', { searchParams: { limit: String(limit) } })
      .json<IApiResponseWrapperType<ITopProduct[]>>();
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch top products');
    }
    throw error;
  }
};
