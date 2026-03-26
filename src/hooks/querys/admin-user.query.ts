import { useQuery } from '@tanstack/react-query'
import {
  getAllUsersClientAPI,
  getAllUserRolesClientAPI,
} from '@/lib/apis/client/admin-user.apis'
import type { IUserFilters } from '@/lib/types/interfaces/apis/admin-user.interfaces'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminUserQueryKeys = {
  all: ['admin', 'users'] as const,
  list: (params: IUserFilters) => ['admin', 'users', 'list', params] as const,
  roles: ['admin', 'users', 'roles'] as const,
}

// ── Get All Users ─────────────────────────────────────────────────────────────

export const useAdminUsersQuery = (params: IUserFilters = {}) =>
  useQuery({
    queryKey: adminUserQueryKeys.list(params),
    queryFn: () => getAllUsersClientAPI(params),
    staleTime: 1000 * 30, // 30 giây
    placeholderData: (prev) => prev, // giữ data cũ khi đang fetch trang mới
  })

// ── Get All User Roles ────────────────────────────────────────────────────────

export const useAdminUserRolesQuery = () =>
  useQuery({
    queryKey: adminUserQueryKeys.roles,
    queryFn: () => getAllUserRolesClientAPI(),
    staleTime: 1000 * 60 * 5, // 5 phút (roles ít thay đổi)
  })
