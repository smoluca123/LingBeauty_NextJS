'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAdminCategoriesClientAPI,
  createCategoryClientAPI,
  createSubCategoryClientAPI,
  updateCategoryClientAPI,
  deleteCategoryClientAPI,
  ICreateCategoryPayload,
  IUpdateCategoryPayload,
} from '@/lib/apis/client/actions/admin-category.actions';

export const ADMIN_CATEGORIES_QUERY_KEY = ['admin', 'categories'] as const;

export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    queryFn: () => getAdminCategoriesClientAPI(),
    select: (data) => data.data,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateCategoryPayload) => createCategoryClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    },
  });
}

export function useCreateSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentId, data }: { parentId: string; data: ICreateCategoryPayload }) =>
      createSubCategoryClientAPI(parentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateCategoryPayload }) =>
      updateCategoryClientAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategoryClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY });
    },
  });
}
