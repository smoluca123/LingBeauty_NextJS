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
} from '@/lib/types/interfaces/apis/order.interfaces'
import { orderQueryKeys } from '@/hooks/querys/order.query'

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: ICreateOrderPayload) => createOrderClientAPI(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Đặt hàng thành công!')
      router.push(`/profile/orders/${data.data.id}`)
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all })
      queryClient.invalidateQueries({
        queryKey: orderQueryKeys.detail(orderId),
      })
      toast.success('Hủy đơn hàng thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Hủy đơn hàng thất bại',
      )
    },
  })
}
