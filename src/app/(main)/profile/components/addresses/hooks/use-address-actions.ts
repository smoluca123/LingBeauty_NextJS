import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  useDeleteMyAddress,
  useSetDefaultMyAddress,
  useUpdateMyAddress,
} from '@/hooks/mutations/address.mutation';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import { AddressFormValues } from '@/lib/zod-schemas/addresses.schema';

/**
 * Custom hook to manage address actions (delete, edit, set default)
 * Encapsulates all address action logic and state management
 */
export function useAddressActions() {
  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  // Edit state
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<IAddressDataType | null>(
    null,
  );

  // Set default state
  const [defaultConfirmOpen, setDefaultConfirmOpen] = useState(false);
  const [addressToSetDefault, setAddressToSetDefault] =
    useState<IAddressDataType | null>(null);

  const deleteAddressMutation = useDeleteMyAddress();
  const updateAddressMutation = useUpdateMyAddress();
  const setDefaultAddressMutation = useSetDefaultMyAddress();

  const openDeleteConfirm = useCallback((addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteConfirmOpen(true);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
    setAddressToDelete(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!addressToDelete) return;

    deleteAddressMutation.mutate(addressToDelete, {
      onSuccess: async () => {
        closeDeleteConfirm();
      },
      onError: (error) => {
        toast.error(
          error.message || 'Không thể xóa địa chỉ. Vui lòng thử lại.',
        );
      },
    });
  }, [addressToDelete, deleteAddressMutation, closeDeleteConfirm]);

  // Set default handlers
  const openDefaultConfirm = useCallback((address: IAddressDataType) => {
    setAddressToSetDefault(address);
    setDefaultConfirmOpen(true);
  }, []);

  const closeDefaultConfirm = useCallback(() => {
    setDefaultConfirmOpen(false);
    setAddressToSetDefault(null);
  }, []);

  const confirmDefault = useCallback(() => {
    if (!addressToSetDefault) return;

    setDefaultAddressMutation.mutate(addressToSetDefault.id, {
      onSuccess: async () => {
        // toast.success('Địa chỉ đã được đặt làm mặc định thành công');
        closeDefaultConfirm();
      },
      onError: (error) => {
        toast.error(
          error.message ||
            'Không thể đặt làm địa chỉ mặc định. Vui lòng thử lại.',
        );
      },
    });
  }, [addressToSetDefault, setDefaultAddressMutation, closeDefaultConfirm]);
  // Edit handlers
  const openEditForm = useCallback((address: IAddressDataType) => {
    setAddressToEdit(address);
    setEditFormOpen(true);
  }, []);

  const closeEditForm = useCallback(() => {
    setEditFormOpen(false);
    setAddressToEdit(null);
  }, []);

  const confirmEdit = useCallback(
    async (formData: AddressFormValues) => {
      if (!addressToEdit) return;

      try {
        await updateAddressMutation.mutateAsync(
          {
            id: addressToEdit.id,
            data: formData,
          },
          {
            onSuccess: async () => {
              closeEditForm();
            },
            onError: (error) => {
              toast.error(
                error.message ||
                  'Không thể cập nhật địa chỉ. Vui lòng thử lại.',
              );
            },
          },
        );
      } catch {
        toast.error('Không thể cập nhật địa chỉ. Vui lòng thử lại.');
      }
    },
    [addressToEdit, updateAddressMutation, closeEditForm],
  );

  return {
    // Delete
    deleteConfirmOpen,
    isDeleting: deleteAddressMutation.isPending,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,

    // Edit
    editFormOpen,
    addressToEdit,
    isUpdating: updateAddressMutation.isPending,
    openEditForm,
    closeEditForm,
    confirmEdit,

    // Set Default
    defaultConfirmOpen,
    addressToSetDefault,
    isSettingDefault: setDefaultAddressMutation.isPending,
    openDefaultConfirm,
    closeDefaultConfirm,
    confirmDefault,
  };
}
