import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useSetDefaultMyAddress } from '@/hooks/mutations/address.mutation';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';

/**
 * Hook to manage set default address action
 * Handles confirmation dialog state and set default mutation
 */
export function useSetDefaultAddress() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState<IAddressDataType | null>(null);

  const mutation = useSetDefaultMyAddress();

  const open = useCallback((addressData: IAddressDataType) => {
    setAddress(addressData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setAddress(null);
  }, []);

  const confirm = useCallback(() => {
    if (!address) return;

    mutation.mutate(address.id, {
      onSuccess: () => {
        close();
      },
      onError: (error) => {
        toast.error(
          error.message ||
            'Không thể đặt làm địa chỉ mặc định. Vui lòng thử lại.',
        );
      },
    });
  }, [address, mutation, close]);

  return {
    isOpen,
    address,
    isSettingDefault: mutation.isPending,
    open,
    close,
    confirm,
  };
}
