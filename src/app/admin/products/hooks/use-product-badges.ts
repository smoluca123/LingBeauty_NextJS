'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProductBadgesClientAPI,
  createBadgeClientAPI,
  createMultipleBadgesClientAPI,
  updateBadgeClientAPI,
  deleteBadgeClientAPI,
  ICreateBadgePayload,
  ICreateMultipleBadgesPayload,
  IUpdateBadgePayload,
} from '@/lib/apis/client/actions/admin-badge.actions';
import { ADMIN_PRODUCTS_QUERY_KEY } from './use-admin-products';

export const PRODUCT_BADGES_QUERY_KEY = (productId: string) =>
  ['admin', 'products', productId, 'badges'] as const;

export function useProductBadges(productId: string | undefined) {
  return useQuery({
    queryKey: PRODUCT_BADGES_QUERY_KEY(productId ?? ''),
    queryFn: () => getProductBadgesClientAPI(productId!),
    enabled: !!productId,
  });
}

export function useCreateBadge(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateBadgePayload) =>
      createBadgeClientAPI(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_BADGES_QUERY_KEY(productId) });
    },
  });
}

export function useCreateMultipleBadges(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateMultipleBadgesPayload) =>
      createMultipleBadgesClientAPI(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PRODUCT_BADGES_QUERY_KEY(productId) });
    },
  });
}

export function useUpdateBadge(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ badgeId, data }: { badgeId: string; data: IUpdateBadgePayload }) =>
      updateBadgeClientAPI(productId, badgeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_BADGES_QUERY_KEY(productId) });
    },
  });
}

export function useDeleteBadge(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (badgeId: string) => deleteBadgeClientAPI(productId, badgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_BADGES_QUERY_KEY(productId) });
    },
  });
}
