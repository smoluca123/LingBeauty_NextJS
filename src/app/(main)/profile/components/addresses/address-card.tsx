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
import { useDeleteAddress } from './hooks/use-delete-address';
import { useEditAddress } from './hooks/use-edit-address';
import { useSetDefaultAddress } from './hooks/use-set-default-address';

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
 * - Edit form dialog
 * - Set default confirmation dialog
 *
 * Each action is managed by its own dedicated hook
 * following Single Responsibility Principle
 */
export function AddressCard({ address }: AddressCardProps) {
  const deleteAction = useDeleteAddress();
  const editAction = useEditAddress();
  const setDefaultAction = useSetDefaultAddress();

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
            onEdit={() => editAction.open(address)}
            onSetDefault={() => setDefaultAction.open(address)}
            onDelete={() => deleteAction.open(address.id)}
          />
        </div>
      </CardContent>

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteAction.isOpen}
        addressName={address.fullName}
        isSubmitting={deleteAction.isDeleting}
        onConfirm={deleteAction.confirm}
        onCancel={deleteAction.close}
      />

      {/* Edit form dialog */}
      {editAction.address && (
        <EditFormDialog
          open={editAction.isOpen}
          address={editAction.address}
          isSubmitting={editAction.isUpdating}
          onSubmit={editAction.confirm}
          onCancel={editAction.close}
        />
      )}

      {/* Set default confirmation dialog */}
      {setDefaultAction.address && (
        <DefaultConfirmationDialog
          open={setDefaultAction.isOpen}
          addressName={setDefaultAction.address.fullName}
          isSubmitting={setDefaultAction.isSettingDefault}
          onConfirm={setDefaultAction.confirm}
          onCancel={setDefaultAction.close}
        />
      )}
    </Card>
  );
}
