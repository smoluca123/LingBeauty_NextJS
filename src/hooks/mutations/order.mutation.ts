import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  createOrderClientAPI,
  cancelOrderClientAPI,
} from '@/lib/apis/client/order.apis'
import type {
  ICreateOrderPayload,
  ICancelOrderPayload,
  IOrderListItemDataType,
} from '@/lib/types/interfaces/apis/order.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { orderQueryKeys } from '@/hooks/querys/order.query'

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: ICreateOrderPayload) => createOrderClientAPI(payload),
    onSuccess: (response) => {
      const orderId = response.data.id

      // Set order detail data immediately - no need to fetch when redirecting
      queryClient.setQueryData(orderQueryKeys.detail(orderId), response)

      // Invalidate order lists to refetch with new order
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })

      // Invalidate cart since items were purchased
      queryClient.invalidateQueries({ queryKey: ['cart'] })

      toast.success('Đặt hàng thành công!')
      router.push(`/profile/orders/${orderId}`)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Đặt hàng thất bại')
    },
  })
}

export const useCancelOrderMutation = (orderId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ICancelOrderPayload) =>
      cancelOrderClientAPI(orderId, payload),
    onSuccess: (response) => {
      // Update order detail immediately with response data
      queryClient.setQueryData(orderQueryKeys.detail(orderId), response)

      // Update all order list queries (my-orders with different params)
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IOrderListItemDataType> | undefined
      >(
        {
          predicate: (query) => {
            const key = query.queryKey
            return key[0] === 'orders' && key[1] === 'my'
          },
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            data: {
              ...oldData.data,
              items: oldData.data.items.map((order) =>
                order.id === orderId
                  ? { ...order, status: response.data.status }
                  : order,
              ),
            },
          }
        },
      )

      toast.success('Hủy đơn hàng thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Hủy đơn hàng thất bại',
      )
    },
  })
}
