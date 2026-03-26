import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  banUserClientAPI,
  banUserBulkClientAPI,
  createUserClientAPI,
  updateUserByAdminClientAPI,
  type IUpdateUserByAdminPayload,
  type ICreateUserByAdminPayload,
} from '@/lib/apis/client/admin-user.apis'
import { adminUserQueryKeys } from '@/hooks/querys/admin-user.query'

// ── Ban / Unban User ──────────────────────────────────────────────────────────

export const useBanUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isBanned }: { userId: string; isBanned: boolean }) =>
      banUserClientAPI(userId, isBanned),
    onSuccess: (_, { isBanned }) => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.all })
      toast.success(isBanned ? 'Đã cấm người dùng' : 'Đã bỏ cấm người dùng')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Thao tác thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Bulk Ban / Unban Users ────────────────────────────────────────────────────

export const useBanUserBulkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (items: { userId: string; isBanned: boolean }[]) =>
      banUserBulkClientAPI(items),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.all })
      const count =
        (data as { data?: { updatedCount?: number } })?.data?.updatedCount ?? 0
      toast.success(`Đã cập nhật trạng thái cho ${count} người dùng`)
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Thao tác hàng loạt thất bại.',
      )
    },
  })
}

// ── Update User By Admin ──────────────────────────────────────────────────────

export const useUpdateUserByAdminMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: IUpdateUserByAdminPayload
    }) => updateUserByAdminClientAPI(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.all })
      toast.success('Cập nhật thông tin người dùng thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Cập nhật thất bại. Vui lòng thử lại.',
      )
    },
  })
}

// ── Create User By Admin ──────────────────────────────────────────────────────

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateUserByAdminPayload) => createUserClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.all })
      toast.success('Tạo tài khoản người dùng thành công')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Tạo tài khoản thất bại. Vui lòng thử lại.',
      )
    },
  })
}
