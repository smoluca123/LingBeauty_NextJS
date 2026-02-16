'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  DeleteConfirmationDialog,
  EditFormDialog,
  DefaultConfirmationDialog,
} from './components';
import { AddressHeader } from './components/address-header';
import { AddressInfo } from './components/address-info';
import { AddressActionsMenu } from './components/address-actions-menu';
import { useAddressActions } from './hooks/use-address-actions';

interface AddressCardProps {
  address: IAddressDataType;
}

/**
 * AddressCard Component
 *
 * Displays a single address card with:
 * - Header with name, default badge, and type badge
 * - Contact information (phone and address)
 * - Actions menu (set default, edit, delete)
 * - Delete confirmation dialog
 * - Edit form dialog (managed internally)
 * - Set default confirmation dialog (managed internally)
 *
 * Optimized for React Compiler with:
 * - Pure sub-components
 * - Custom hooks for state management
 * - Minimized inline logic
 */
export function AddressCard({ address }: AddressCardProps) {
  const {
    deleteConfirmOpen,
    isDeleting,
    closeDeleteConfirm,
    confirmDelete,
    openDeleteConfirm,
    editFormOpen,
    addressToEdit,
    isUpdating,
    openEditForm,
    closeEditForm,
    confirmEdit,
    defaultConfirmOpen,
    addressToSetDefault,
    isSettingDefault,
    openDefaultConfirm,
    closeDefaultConfirm,
    confirmDefault,
  } = useAddressActions();

  return (
    <Card
      className={`overflow-hidden transition-all ${
        address.isDefault
          ? 'border-primary-pink ring-1 ring-primary-pink/20'
          : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Main content */}
          <div className="flex-1 space-y-2">
            <AddressHeader
              fullName={address.fullName}
              isDefault={address.isDefault}
              type={address.type}
            />
            <AddressInfo address={address} />
          </div>

          {/* Actions menu */}
          <AddressActionsMenu
            addressId={address.id}
            isDefault={address.isDefault}
            onEdit={() => openEditForm(address)}
            onSetDefault={() => openDefaultConfirm(address)}
            onDelete={openDeleteConfirm}
          />
        </div>
      </CardContent>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        addressName={address.fullName}
        isSubmitting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={closeDeleteConfirm}
      />

      {/* Edit form dialog */}
      {addressToEdit && (
        <EditFormDialog
          open={editFormOpen}
          address={addressToEdit}
          isSubmitting={isUpdating}
          onSubmit={confirmEdit}
          onCancel={closeEditForm}
        />
      )}

      {/* Set default confirmation dialog */}
      {addressToSetDefault && (
        <DefaultConfirmationDialog
          open={defaultConfirmOpen}
          addressName={addressToSetDefault.fullName}
          isSubmitting={isSettingDefault}
          onConfirm={confirmDefault}
          onCancel={closeDefaultConfirm}
        />
      )}
    </Card>
  );
}
