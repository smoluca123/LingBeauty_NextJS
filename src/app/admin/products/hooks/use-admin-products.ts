'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminProductsClientAPI,
  createProductClientAPI,
  updateProductClientAPI,
  deleteProductClientAPI,
  IAdminProductQueryParams,
  ICreateProductPayload,
  IUpdateProductPayload,
} from '@/lib/apis/client/actions/admin-product.actions';
import {
  createVariantClientAPI,
  getProductVariantsClientAPI,
  updateVariantClientAPI,
  deleteVariantClientAPI,
  ICreateVariantPayload,
  IUpdateVariantPayload,
} from '@/lib/apis/client/actions/admin-variant.actions';

export const ADMIN_PRODUCTS_QUERY_KEY = ['admin', 'products'] as const;
export const PRODUCT_VARIANTS_QUERY_KEY = (productId: string) =>
  ['admin', 'products', productId, 'variants'] as const;

export function useAdminProducts(params: IAdminProductQueryParams = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: [...ADMIN_PRODUCTS_QUERY_KEY, params],
    queryFn: () => getAdminProductsClientAPI(params),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateProductPayload) => createProductClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateProductPayload }) =>
      updateProductClientAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
    },
  });
}

export function useCreateVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateVariantPayload) =>
      createVariantClientAPI(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANTS_QUERY_KEY(productId) });
    },
  });
}

export function useProductVariants(productId: string | undefined) {
  return useQuery({
    queryKey: PRODUCT_VARIANTS_QUERY_KEY(productId ?? ''),
    queryFn: () => getProductVariantsClientAPI(productId!),
    enabled: !!productId,
  });
}

export function useUpdateVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, data }: { variantId: string; data: IUpdateVariantPayload }) =>
      updateVariantClientAPI(productId, variantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANTS_QUERY_KEY(productId) });
    },
  });
}

export function useDeleteVariant(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variantId: string) => deleteVariantClientAPI(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_VARIANTS_QUERY_KEY(productId) });
    },
  });
}
