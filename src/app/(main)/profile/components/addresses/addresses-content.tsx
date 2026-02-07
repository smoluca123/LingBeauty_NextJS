'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  MOCK_ADDRESSES,
  type Address,
} from '../../addresses/_data/mock-addresses';
import { AddressCard } from './address-card';
import { DeleteConfirmationDialog, AddressFormDialog } from './components';

// ============ Main Component ============
export function AddressesContent() {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormDialogOpen(true);
  };

  const handleEditAddress = (id: string) => {
    const address = addresses.find((addr) => addr.id === id);
    if (address) {
      setEditingAddress(address);
      setFormDialogOpen(true);
    }
  };

  const handleFormSubmit = (data: Omit<Address, 'id'>) => {
    if (editingAddress) {
      // Update existing address
      console.log('✏️ Update address:', editingAddress.id, data);
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddress.id
            ? { ...data, id: addr.id }
            : data.isDefault
              ? { ...addr, isDefault: false }
              : addr,
        ),
      );
    } else {
      // Add new address
      const newAddress: Address = {
        ...data,
        id: Date.now().toString(),
      };
      console.log('➕ Add new address:', newAddress);
      setAddresses((prev) => {
        if (newAddress.isDefault) {
          return [...prev.map((addr) => ({ ...addr, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
    }
  };

  const handleDeleteAddress = (id: string) => {
    // Open confirmation dialog instead of deleting immediately
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      console.log('🗑️ Delete address:', addressToDelete);
      setAddresses((prev) =>
        prev.filter((addr) => addr.id !== addressToDelete),
      );
      setAddressToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const cancelDelete = () => {
    setAddressToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleSetDefault = (id: string) => {
    console.log('⭐ Set default address:', id);
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  // Sort addresses: default first
  const sortedAddresses = [...addresses].sort((a, b) =>
    a.isDefault ? -1 : b.isDefault ? 1 : 0,
  );

  // Find the address that is about to be deleted for display in dialog
  const addressToDeleteData = addressToDelete
    ? addresses.find((addr) => addr.id === addressToDelete)
    : null;

  return (
    <>
      <div className="space-y-4">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {addresses.length} địa chỉ đã lưu
          </p>
          <Button
            onClick={handleAddAddress}
            className="h-10 rounded-full bg-primary-pink hover:bg-primary-pink/90 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm địa chỉ
          </Button>
        </div>

        {/* Address List */}
        <div className="grid gap-4">
          {sortedAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      </div>

      {/* Address Form Dialog */}
      <AddressFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleFormSubmit}
        editAddress={editingAddress}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        addressName={addressToDeleteData?.name || null}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
