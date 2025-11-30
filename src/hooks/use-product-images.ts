import { useMemo } from 'react';

import {
  IProductDataType,
  IProductImageDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * Hook to combine and deduplicate product images from primary, gallery, and variants
 */
export function useProductImages(product: IProductDataType) {
  return useMemo(() => {
    const { primaryImage, images, variants } = product;
    const allImages = [primaryImage];

    if (images) {
      allImages.push(...images);
    }

    if (variants) {
      variants.forEach((variant) => {
        if (variant.images && variant.images.length > 0) {
          allImages.push(...variant.images);
        }
      });
    }

    // Remove duplicates based on media.url
    const uniqueImages = Array.from(
      new Map(
        allImages.map((img: IProductImageDataType) => [img.media.url, img])
      ).values()
    );

    return uniqueImages;
  }, [product]);
}
