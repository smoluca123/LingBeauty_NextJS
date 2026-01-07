import { useMemo } from 'react';

import {
  IProductDataType,
  IProductImageDataType,
} from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * Hook to combine and deduplicate product images from primary, gallery, and variants
 * Images are deduplicated by media URL and sorted by sortOrder
 */
export function useProductImages(product: IProductDataType) {
  return useMemo(() => {
    const { primaryImage, images, variants } = product;

    // Collect all images in a single pass
    const allImages = [
      primaryImage,
      ...(images || []),
      ...(variants?.flatMap((variant) => variant.images || []) || []),
    ].filter((img): img is IProductImageDataType => img !== undefined);

    // Deduplicate by media URL, keeping the first occurrence (which preserves priority)
    const uniqueImagesMap = new Map<string, IProductImageDataType>();

    for (const img of allImages) {
      if (!uniqueImagesMap.has(img.media.url)) {
        uniqueImagesMap.set(img.media.url, img);
      }
    }

    // Sort by sortOrder to maintain intended display order
    return Array.from(uniqueImagesMap.values()).sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }, [product]);
}
