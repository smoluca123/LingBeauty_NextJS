'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllUsersAdminAPI,
  updateUserAdminAPI,
  banUserAdminAPI,
  createUserAdminAPI,
  getAllUserRolesAPI,
  IAdminUserQueryParams,
  IUpdateUserAdminPayload,
  ICreateUserAdminPayload,
} from '@/lib/apis/client/actions/admin-user.actions';

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const;
export const ADMIN_USER_ROLES_QUERY_KEY = ['admin', 'users', 'roles'] as const;

export function useAdminUsers(params: IAdminUserQueryParams = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: [...ADMIN_USERS_QUERY_KEY, params],
    queryFn: () => getAllUsersAdminAPI(params),
  });
}

export function useAdminUserRoles() {
  return useQuery({
    queryKey: ADMIN_USER_ROLES_QUERY_KEY,
    queryFn: () => getAllUserRolesAPI(),
    staleTime: 5 * 60 * 1000, // roles rarely change — cache 5 min
  });
}

export function useCreateUserAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateUserAdminPayload) => createUserAdminAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}

export function useUpdateUserAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateUserAdminPayload }) =>
      updateUserAdminAPI({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}

export function useBanUserAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) =>
      banUserAdminAPI({ id, isBanned }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
}
