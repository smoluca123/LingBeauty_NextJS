import { useQuery } from '@tanstack/react-query'
import {
  getAllOrdersClientAPI,
  getOrderByIdAdminClientAPI,
} from '@/lib/apis/client/admin-order.apis'
import type { IAdminOrderFilters } from '@/lib/types/interfaces/apis/admin-order.interfaces'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminOrderQueryKeys = {
  all: ['admin', 'orders'] as const,
  list: (params: IAdminOrderFilters) =>
    ['admin', 'orders', 'list', params] as const,
  detail: (orderId: string) => ['admin', 'orders', 'detail', orderId] as const,
}

// ── Get All Orders (Admin) ────────────────────────────────────────────────────

export const useAdminOrdersQuery = (params: IAdminOrderFilters = {}) =>
  useQuery({
    queryKey: adminOrderQueryKeys.list(params),
    queryFn: () => getAllOrdersClientAPI(params),
    staleTime: 1000 * 30, // 30 giây
    placeholderData: (prev) => prev, // giữ data cũ khi đang fetch trang mới
  })

// ── Get Order Detail (Admin) ──────────────────────────────────────────────────

export const useAdminOrderDetailQuery = (orderId: string | null) =>
  useQuery({
    queryKey: adminOrderQueryKeys.detail(orderId ?? ''),
    queryFn: () => getOrderByIdAdminClientAPI(orderId!),
    enabled: !!orderId,
    staleTime: 1000 * 30,
  })
