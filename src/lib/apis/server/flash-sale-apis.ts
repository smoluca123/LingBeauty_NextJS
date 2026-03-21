'use server';

import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IFlashSaleDataType } from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import { cacheLife, cacheTag } from 'next/cache';
import { DEFAULT_CACHE_TIME } from '@/constants/cache';

/**
 * Get current active flash sale
 * This is a public endpoint - no authentication required
 */
export async function getActiveFlashSaleAPI(): Promise<IFlashSaleDataType | null> {
  'use cache';
  cacheTag('flash-sale');
  cacheLife(DEFAULT_CACHE_TIME);

  try {
    const response = await publicKyInstance
      .get('flash-sales/current')
      .json<IApiResponseWrapperType<IFlashSaleDataType | null>>();

    return response.data;
  } catch (error: unknown) {
    console.log('Error fetching active flash sale:', error);
    // Return null if no active flash sale or any error
    return null;
  }
}

/**
 * Get upcoming flash sales
 * This is a public endpoint - no authentication required
 */
export async function getUpcomingFlashSalesAPI(): Promise<
  IFlashSaleDataType[]
> {
  'use cache';
  cacheTag('flash-sales-upcoming');
  cacheLife(DEFAULT_CACHE_TIME);

  try {
    const response = await publicKyInstance
      .get('flash-sales/upcoming')
      .json<IApiResponseWrapperType<IFlashSaleDataType[]>>();

    return response.data || [];
  } catch (error: unknown) {
    console.log('Error fetching upcoming flash sales:', error);
    return [];
  }
}
