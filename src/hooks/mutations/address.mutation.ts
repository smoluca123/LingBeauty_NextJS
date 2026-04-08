import { addMyAddressAPI } from '@/lib/apis/client/actions/address.actions'
import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { queryClient } from '@/lib/query-client/query-client'
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces'
import {
  IApiResponseWrapperType,
  INextApiResponseWrapperType,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type { AddressFormValues } from '@/lib/types/forms'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useAddMyAddress = () => {
  const addMyAddress = async (data: AddressFormValues) => {
    try {
      const response = await addMyAddressAPI(data)
      return response
    } catch (error) {
      throw new Error(error as string)
    }
  }

  return useMutation({
    mutationFn: addMyAddress,
    onSuccess: (response) => {
      // Update cache with new address
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAddressDataType>
      >({ queryKey: ['addresses'] }, (oldData) => {
        if (!oldData || !response.data) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: [response.data, ...(oldData.data?.items || [])],
            totalCount: (oldData.data?.totalCount || 0) + 1,
          },
        }
      })

      toast.success(response.message || 'Thêm địa chỉ thành công!')
    },
    onError: (error) => {
      toast.error(error.message || 'Thêm địa chỉ thất bại!')
    },
  })
}

export const useUpdateMyAddress = () => {
  const updateMyAddress = async ({
    id,
    data,
  }: {
    id: string
    data: AddressFormValues
  }) => {
    try {
      const response = await kyNextInstance
        .patch(`me/address/${id}`, {
          json: data,
        })
        .json<
          INextApiResponseWrapperType<IApiResponseWrapperType<IAddressDataType>>
        >()
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to update address')
    }
  }

  return useMutation({
    mutationFn: updateMyAddress,
    onSuccess: (response, variables) => {
      // Update cache with updated address
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAddressDataType>
      >({ queryKey: ['addresses'] }, (oldData) => {
        if (!oldData || !response.data) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data?.items?.map((addr) =>
              addr.id === variables.id ? response.data : addr,
            ),
          },
        }
      })

      toast.success(response.message || 'Cập nhật địa chỉ thành công!')
    },
    onError: (error) => {
      toast.error(error.message || 'Cập nhật địa chỉ thất bại!')
    },
  })
}

export const useDeleteMyAddress = () => {
  const deleteMyAddress = async (id: string) => {
    try {
      const response = await kyNextInstance.delete(`me/address/${id}`).json<
        INextApiResponseWrapperType<
          IApiResponseWrapperType<{
            message: string
          }>
        >
      >()
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to delete address')
    }
  }

  return useMutation({
    mutationFn: deleteMyAddress,
    onSuccess: (_response, deletedId) => {
      // Update cache by removing deleted address
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAddressDataType>
      >({ queryKey: ['addresses'] }, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data?.items?.filter((addr) => addr.id !== deletedId),
            totalCount: Math.max((oldData.data?.totalCount || 0) - 1, 0),
          },
        }
      })

      toast.success('Địa chỉ đã được xóa thành công')
    },
    onError: (error) => {
      toast.error(error.message || 'Xóa địa chỉ thất bại!')
    },
  })
}

export const useSetDefaultMyAddress = () => {
  const setDefaultMyAddress = async (id: string) => {
    try {
      const response = await kyNextInstance
        .patch(`me/address/${id}`, {
          json: {
            isDefault: true,
          },
        })
        .json<
          INextApiResponseWrapperType<IApiResponseWrapperType<IAddressDataType>>
        >()
      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to set default address')
    }
  }

  return useMutation({
    mutationFn: setDefaultMyAddress,
    onSuccess: (_response, newDefaultId) => {
      // Update cache: set all addresses to non-default, then set the selected one as default
      queryClient.setQueriesData<
        IApiPaginationResponseWrapperType<IAddressDataType>
      >({ queryKey: ['addresses'] }, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data?.items?.map((addr) => ({
              ...addr,
              isDefault: addr.id === newDefaultId,
            })),
          },
        }
      })

      toast.success('Đặt làm địa chỉ mặc định thành công!')
    },
    onError: (error) => {
      toast.error(error.message || 'Đặt làm địa chỉ mặc định thất bại!')
    },
  })
}
