import { addMyAddressAPI } from "@/lib/apis/client/actions/address.actions";
import { kyNextInstance } from "@/lib/kyInstance/kyNext";
import { queryClient } from "@/lib/query-client/query-client";
import { IAddressDataType } from "@/lib/types/interfaces/apis/address.interfaces";
import {
  IApiResponseWrapperType,
  INextApiResponseWrapperType,
} from "@/lib/types/interfaces/apis/api.interfaces";
import type { AddressFormValues } from "@/lib/types/forms";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAddMyAddress = () => {
  // const queryClient = useQueryClient();
  const addMyAddress = async (data: AddressFormValues) => {
    try {
      const response = await addMyAddressAPI(data);
      return response;
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return useMutation({
    mutationFn: addMyAddress,
    onSuccess: (data) => {
      // Invalidate queries to refetch addresses
      // queryClient.invalidateQueries({
      //   queryKey: getMyAddressesQueryKey({ page: values., limit }),
      // });

      // Show success toast
      toast.success(data.message || "Thêm địa chỉ thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Thêm địa chỉ thất bại!");
    },
  });
};

export const useUpdateMyAddress = () => {
  const updateMyAddress = async ({
    id,
    data,
  }: {
    id: string;
    data: AddressFormValues;
  }) => {
    try {
      const response = await kyNextInstance
        .patch(`me/address/${id}`, {
          json: data,
        })
        .json<
          INextApiResponseWrapperType<IApiResponseWrapperType<IAddressDataType>>
        >();
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to update address");
    }
  };

  return useMutation({
    mutationFn: updateMyAddress,
    onSuccess: async (data) => {
      // Invalidate queries to refetch addresses
      // queryClient.invalidateQueries({
      //   queryKey: getMyAddressesQueryKey({ page: values., limit }),
      // });

      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });
      // Show success toast
      toast.success(data.message || "Cập nhật địa chỉ thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Cập nhật địa chỉ thất bại!");
    },
  });
};

export const useDeleteMyAddress = () => {
  const deleteMyAddress = async (id: string) => {
    try {
      const response = await kyNextInstance.delete(`me/address/${id}`).json<
        INextApiResponseWrapperType<
          IApiResponseWrapperType<{
            message: string;
          }>
        >
      >();
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete address");
    }
  };

  return useMutation({
    mutationFn: deleteMyAddress,
    onSuccess: async () => {
      // Invalidate queries to refetch addresses
      // queryClient.invalidateQueries({
      //   queryKey: getMyAddressesQueryKey({ page: values., limit }),
      // });

      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      toast.success("Địa chỉ đã được xóa thành công");
    },
    onError: (error) => {
      toast.error(error.message || "Xóa địa chỉ thất bại!");
    },
  });
};

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
        >();
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to delete address");
    }
  };

  return useMutation({
    mutationFn: setDefaultMyAddress,
    onSuccess: async () => {
      // Invalidate queries to refetch addresses
      await queryClient.invalidateQueries({
        queryKey: ["addresses"],
      });

      // Show success toast
      toast.success("Đặt làm địa chỉ mặc định thành công!");
    },
    onError: (error) => {
      toast.error(error.message || "Đặt làm địa chỉ mặc định thất bại!");
    },
  });
};
