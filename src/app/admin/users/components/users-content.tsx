'use client';

import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockAdminUsers, mockAdminRoles } from '@/lib/mock-data/admin';
import { IAdminUserDataType } from '@/lib/types/interfaces/apis/admin-user.interfaces';
import { TablePagination } from '@/app/admin/components';
import { usePagination } from '@/app/admin/hooks';
import { UsersFilters } from './users-filters';
import { UsersTable } from './users-table';
import { DeleteUserDialog } from './delete-user-dialog';
import { BanUserDialog } from './ban-user-dialog';
import { EditUserDialog, UserFormData } from './edit-user-dialog';
import { AddUserDialog } from './add-user-dialog';

export function UsersContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const {
      resetPage,
      paginate,
      getPaginationProps,
    } = usePagination();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IAdminUserDataType | null>(null);

  // Filter users
  const filteredUsers = mockAdminUsers.filter((user) => {
    const fullName = `${user.lastName} ${user.firstName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === 'all' || user.roles.some((r) => r.id === roleFilter);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive && !user.isBanned) ||
      (statusFilter === 'inactive' && !user.isActive) ||
      (statusFilter === 'banned' && user.isBanned);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  // Pagination
  const paginatedUsers = useMemo(
    () => paginate(filteredUsers),
    [filteredUsers, paginate]
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetPage();
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    resetPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

  // Removed handlePageSizeChange since handled by hook

  const handleDelete = (user: IAdminUserDataType) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleBan = (user: IAdminUserDataType) => {
    setSelectedUser(user);
    setBanDialogOpen(true);
  };

  const handleEdit = (user: IAdminUserDataType) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (data: UserFormData) => {
    console.log('Saving edited user:', selectedUser?.id, data);
    // Here you would call your API to save the user data
  };

  const confirmDelete = () => {
    console.log('Deleting user:', selectedUser?.id);
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmBan = () => {
    console.log('Banning user:', selectedUser?.id);
    setBanDialogOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = (data: UserFormData) => {
    console.log('Creating new user:', data);
    // TODO: API call to create user
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Người dùng</h1>
          <p className="text-muted-foreground">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          variant="primary-pink"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Filters */}
      <div className="shrink-0">
        <UsersFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          roleFilter={roleFilter}
          onRoleChange={handleRoleChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          roles={mockAdminRoles}
        />
      </div>

      {/* Table - takes remaining space and scrolls */}
      <div className="flex-1 min-h-0">
        <UsersTable
          users={paginatedUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBan={handleBan}
        />
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination
          {...getPaginationProps(filteredUsers.length)}
        />
      </div>

      {/* Dialogs */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={selectedUser}
        onConfirm={confirmDelete}
      />

      <BanUserDialog
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        user={selectedUser}
        onConfirm={confirmBan}
      />

      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveEdit}
      />

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddUser}
      />
    </div>
  );
}
