import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  bulkAdjustInventoryClientAPI,
  adjustProductInventoryClientAPI,
  updateProductInventoryClientAPI,
  adjustVariantInventoryClientAPI,
  updateVariantInventoryClientAPI,
} from '@/lib/apis/client/admin-inventory.apis'
import type {
  IAdjustInventoryPayload,
  IBulkAdjustInventoryPayload,
  IUpdateInventoryPayload,
} from '@/lib/types/interfaces/apis/admin-inventory.interfaces'
import { getErrorMessage } from '@/lib/utils/error-handler'
import { inventoryQueryKeys } from '@/hooks/querys/admin-inventory.query'

// ── Adjust Product Inventory ──────────────────────────────────────────────────

export const useAdjustProductInventoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string
      payload: IAdjustInventoryPayload
    }) => adjustProductInventoryClientAPI(productId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all })
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Điều chỉnh thất bại. Vui lòng thử lại.'),
      )
    },
  })
}

// ── Update Product Inventory ──────────────────────────────────────────────────

export const useUpdateProductInventoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string
      payload: IUpdateInventoryPayload
    }) => updateProductInventoryClientAPI(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all })
      toast.success('Cập nhật kho hàng thành công')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Cập nhật thất bại. Vui lòng thử lại.'),
      )
    },
  })
}

// ── Adjust Variant Inventory ──────────────────────────────────────────────────

export const useAdjustVariantInventoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      payload,
    }: {
      productId: string
      variantId: string
      payload: IAdjustInventoryPayload
    }) => adjustVariantInventoryClientAPI(productId, variantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all })
      toast.success('Điều chỉnh kho hàng biến thể thành công')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Điều chỉnh thất bại. Vui lòng thử lại.'),
      )
    },
  })
}

// ── Update Variant Inventory ──────────────────────────────────────────────────

export const useUpdateVariantInventoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      payload,
    }: {
      productId: string
      variantId: string
      payload: IUpdateInventoryPayload
    }) => updateVariantInventoryClientAPI(productId, variantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all })
      toast.success('Cập nhật kho hàng biến thể thành công')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Cập nhật thất bại. Vui lòng thử lại.'),
      )
    },
  })
}

// ── Bulk Adjust Inventory ─────────────────────────────────────────────────────

export const useBulkAdjustInventoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IBulkAdjustInventoryPayload) =>
      bulkAdjustInventoryClientAPI(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.all })
      toast.success('Điều chỉnh hàng loạt thành công')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          'Điều chỉnh hàng loạt thất bại. Vui lòng thử lại.',
        ),
      )
    },
  })
}
