'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  uploadProductImageClientAPI,
  getProductImagesClientAPI,
  updateProductImageClientAPI,
  deleteProductImageClientAPI,
} from '@/lib/apis/client/actions/admin-product-image.actions';
import type { IUpdateProductImagePayload } from '@/lib/apis/server/actions/admin-product-image.actions';
import { ADMIN_PRODUCTS_QUERY_KEY } from './use-admin-products';

export const PRODUCT_IMAGES_QUERY_KEY = (productId: string) =>
  ['admin', 'products', productId, 'images'] as const;

export function useProductImages(productId: string | null) {
  return useQuery({
    queryKey: PRODUCT_IMAGES_QUERY_KEY(productId ?? ''),
    queryFn: () => getProductImagesClientAPI(productId!),
    enabled: !!productId,
    select: (res) => res.data,
  });
}

export function useUploadProductImage(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      isPrimary,
      alt,
      variantId,
    }: {
      file: File;
      isPrimary?: boolean;
      alt?: string;
      variantId?: string;
    }) => uploadProductImageClientAPI(productId, file, { isPrimary, alt, variantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_IMAGES_QUERY_KEY(productId) });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}

export function useUpdateProductImage(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, payload }: { imageId: string; payload: IUpdateProductImagePayload }) =>
      updateProductImageClientAPI(productId, imageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_IMAGES_QUERY_KEY(productId) });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}

export function useDeleteProductImage(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => deleteProductImageClientAPI(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_IMAGES_QUERY_KEY(productId) });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}
