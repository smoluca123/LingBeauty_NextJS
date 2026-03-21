'use server';

import { publicKyInstance } from '@/lib/kyInstance/publicKy';
import { IFlashSaleDataType } from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import { cacheLife, cacheTag } from 'next/cache';
import { DEFAULT_CACHE_TIME } from '@/constants/cache';
import { kyInstance } from '@/lib/kyInstance/ky';
import type { FlashSale, FlashSaleProduct } from '@/types/flash-sale';
import type {
  IFlashSaleDataType,
  IFlashSaleProductDataType,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';

/**
 * Transform API product data to FlashSaleProduct format
 */
function transformFlashSaleProduct(
  product: IFlashSaleProductDataType,
): FlashSaleProduct {
  return {
    id: product.id,
    productId: product.productId,
    variantId: product.variantId,
    flashPrice:
      typeof product.flashPrice === 'string'
        ? Number(product.flashPrice)
        : product.flashPrice,
    originalPrice:
      typeof product.originalPrice === 'string'
        ? Number(product.originalPrice)
        : product.originalPrice,
    maxQuantity: product.maxQuantity,
    soldQuantity: product.soldQuantity,
    limitPerOrder: product.limitPerOrder,
    product: {
      id: product.product?.id || product.productId,
      name: product.product?.name || '',
      slug: product.product?.slug || '',
      image: product.product?.primaryImage || '',
      brand: {
        name: '', // Brand info not available from current API response
      },
      rating: undefined,
      reviewCount: undefined,
    },
    badges: undefined, // Badges not available from current API response
  };
}

/**
 * Transform API flash sale data to FlashSale format
 */
function transformFlashSale(flashSale: IFlashSaleDataType): FlashSale {
  return {
    id: flashSale.id,
    name: flashSale.name,
    slug: flashSale.slug,
    banner: flashSale.banner,
    startTime:
      typeof flashSale.startTime === 'string'
        ? flashSale.startTime
        : flashSale.startTime.toISOString(),
    endTime:
      typeof flashSale.endTime === 'string'
        ? flashSale.endTime
        : flashSale.endTime.toISOString(),
    status: flashSale.status,
    products:
      flashSale.products?.map(transformFlashSaleProduct) ||
      ([] as FlashSaleProduct[]),
  };
}

/**
 * Get current active flash sale from API
 */
export async function getActiveFlashSaleAPI(): Promise<FlashSale | null> {
  const response = await kyInstance
    .get('flash-sales/current')
    .json<IApiResponseWrapperType<IFlashSaleDataType | null>>();

  if (!response.data) {
    return null;
  }

  return transformFlashSale(response.data);

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
