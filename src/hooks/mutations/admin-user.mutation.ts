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
import type { IAdminUserDataType } from '@/lib/types/interfaces/apis/admin-user.interfaces'
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

// ── Ban / Unban User ──────────────────────────────────────────────────────────

export const useBanUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isBanned }: { userId: string; isBanned: boolean }) =>
      banUserClientAPI(userId, isBanned),
    onSuccess: (response, { userId, isBanned }) => {
      // Update cache: find and update the user's isBanned status
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAdminUserDataType>
      >({ queryKey: adminUserQueryKeys.all }, (oldData) => {
        if (!oldData || !response.data) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((user) =>
              user.id === userId ? response.data : user,
            ),
          },
        }
      })

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
    onSuccess: (response, items) => {
      // Update cache: update multiple users' isBanned status
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAdminUserDataType>
      >({ queryKey: adminUserQueryKeys.all }, (oldData) => {
        if (!oldData) return oldData

        const userIdMap = new Map(
          items.map((item) => [item.userId, item.isBanned]),
        )

        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((user) => {
              const newBannedStatus = userIdMap.get(user.id)
              if (newBannedStatus !== undefined) {
                return { ...user, isBanned: newBannedStatus }
              }
              return user
            }),
          },
        }
      })

      const count = response.data?.updatedCount ?? 0
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
    onSuccess: (response, { userId }) => {
      // Update cache: replace updated user
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAdminUserDataType>
      >({ queryKey: adminUserQueryKeys.all }, (oldData) => {
        if (!oldData || !response.data) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((user) =>
              user.id === userId ? response.data : user,
            ),
          },
        }
      })

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
    onSuccess: (response) => {
      // Update cache: add new user to the beginning of the list
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAdminUserDataType>
      >({ queryKey: adminUserQueryKeys.all }, (oldData) => {
        if (!oldData || !response.data) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: [response.data, ...oldData.data.items],
            totalCount: oldData.data.totalCount + 1,
          },
        }
      })

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
