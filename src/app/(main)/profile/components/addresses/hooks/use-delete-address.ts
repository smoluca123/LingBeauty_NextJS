import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useDeleteMyAddress } from '@/hooks/mutations/address.mutation';

/**
 * Hook to manage delete address action
 * Handles confirmation dialog state and delete mutation
 */
export function useDeleteAddress() {
  const [isOpen, setIsOpen] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);

  const mutation = useDeleteMyAddress();

  const open = useCallback((id: string) => {
    setAddressId(id);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setAddressId(null);
  }, []);

  const confirm = useCallback(() => {
    if (!addressId) return;

    mutation.mutate(addressId, {
      onSuccess: () => {
        close();
      },
      onError: (error) => {
        toast.error(
          error.message || 'Không thể xóa địa chỉ. Vui lòng thử lại.',
        );
      },
    });
  }, [addressId, mutation, close]);

  return {
    isOpen,
    isDeleting: mutation.isPending,
    open,
    close,
    confirm,
  };
}
