import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateOrderClientAPI } from '@/lib/apis/client/admin-order.apis'
import type { IUpdateOrderPayload } from '@/lib/types/interfaces/apis/admin-order.interfaces'
import { adminOrderQueryKeys } from '@/hooks/querys/admin-order.query'

/**
 * Mutation để cập nhật đơn hàng (Admin)
 */
export const useUpdateOrderMutation = (orderId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IUpdateOrderPayload) =>
      updateOrderClientAPI(orderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminOrderQueryKeys.all })
      queryClient.invalidateQueries({
        queryKey: adminOrderQueryKeys.detail(orderId),
      })
      toast.success('Cập nhật đơn hàng thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật đơn hàng thất bại',
      )
    },
  })
}
