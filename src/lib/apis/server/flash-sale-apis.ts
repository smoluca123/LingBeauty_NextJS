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
}
