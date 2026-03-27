import { useQuery } from '@tanstack/react-query'
import {
  getMyOrdersClientAPI,
  getOrderByIdClientAPI,
} from '@/lib/apis/client/order.apis'
import type { IGetMyOrdersParams } from '@/lib/types/interfaces/apis/order.interfaces'

export const orderQueryKeys = {
  all: ['orders'] as const,
  myOrders: (params: IGetMyOrdersParams) => ['orders', 'my', params] as const,
  detail: (orderId: string) => ['orders', 'detail', orderId] as const,
}

export const useGetMyOrdersQuery = (params: IGetMyOrdersParams = {}) =>
  useQuery({
    queryKey: orderQueryKeys.myOrders(params),
    queryFn: () => getMyOrdersClientAPI(params),
    staleTime: 1000 * 30,
  })

export const useGetOrderByIdQuery = (orderId: string) =>
  useQuery({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => getOrderByIdClientAPI(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 30,
  })
