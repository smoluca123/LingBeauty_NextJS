import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useUpdateMyAddress } from "@/hooks/mutations/address.mutation";
import { IAddressDataType } from "@/lib/types/interfaces/apis/address.interfaces";
import type { AddressFormValues } from "@/lib/types/forms";

/**
 * Hook to manage edit address action
 * Handles edit form dialog state and update mutation
 */
export function useEditAddress() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState<IAddressDataType | null>(null);

  const mutation = useUpdateMyAddress();

  const open = useCallback((addressData: IAddressDataType) => {
    setAddress(addressData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setAddress(null);
  }, []);

  const confirm = useCallback(
    async (formData: AddressFormValues) => {
      if (!address) return;

      try {
        await mutation.mutateAsync(
          {
            id: address.id,
            data: formData,
          },
          {
            onSuccess: () => {
              close();
            },
            onError: (error) => {
              toast.error(
                error.message ||
                  "Không thể cập nhật địa chỉ. Vui lòng thử lại.",
              );
            },
          },
        );
      } catch {
        toast.error("Không thể cập nhật địa chỉ. Vui lòng thử lại.");
      }
    },
    [address, mutation, close],
  );

  return {
    isOpen,
    address,
    isUpdating: mutation.isPending,
    open,
    close,
    confirm,
  };
}
