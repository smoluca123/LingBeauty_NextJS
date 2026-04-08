import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateOrderClientAPI } from '@/lib/apis/client/admin-order.apis'
import type {
  IUpdateOrderPayload,
  IAdminOrderListItemDataType,
  IAdminOrderDataType,
} from '@/lib/types/interfaces/apis/admin-order.interfaces'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import { adminOrderQueryKeys } from '@/hooks/querys/admin-order.query'

/**
 * Mutation để cập nhật đơn hàng (Admin)
 */
export const useUpdateOrderMutation = (orderId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IUpdateOrderPayload) =>
      updateOrderClientAPI(orderId, payload),
    onSuccess: (response) => {
      if (!response.data) return

      // Update list cache: update order in the list
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAdminOrderListItemDataType>
      >({ queryKey: adminOrderQueryKeys.all }, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: response.data.status,
                    updatedAt: response.data.updatedAt,
                  }
                : order,
            ),
          },
        }
      })

      // Update detail cache: replace with full updated order
      queryClient.setQueryData<IApiResponseWrapperType<IAdminOrderDataType>>(
        adminOrderQueryKeys.detail(orderId),
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            data: response.data,
          }
        },
      )

      toast.success('Cập nhật đơn hàng thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật đơn hàng thất bại',
      )
    },
  })
}
