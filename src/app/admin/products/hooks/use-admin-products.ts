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

export const ADMIN_PRODUCTS_QUERY_KEY = ['admin', 'products'] as const;

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
