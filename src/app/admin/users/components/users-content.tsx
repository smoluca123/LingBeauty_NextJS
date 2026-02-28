'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IAdminUserDataType } from '@/lib/types/interfaces/apis/admin-user.interfaces';
import { ICreateUserAdminPayload } from '@/lib/apis/client/actions/admin-user.actions';
import { TablePagination } from '@/app/admin/components';
import { usePagination } from '@/app/admin/hooks';
import { UsersFilters } from './users-filters';
import { UsersTable } from './users-table';
import { DeleteUserDialog } from './delete-user-dialog';
import { BanUserDialog } from './ban-user-dialog';
import { EditUserDialog, UserFormData } from './edit-user-dialog';
import { AddUserDialog } from './add-user-dialog';
import { useAdminUsers, useBanUserAdmin, useCreateUserAdmin, useUpdateUserAdmin } from '../hooks';

// Map FE status filter → BE query params
function resolveStatusParams(
  statusFilter: string,
): { isActive?: boolean; isBanned?: boolean } {
  switch (statusFilter) {
    case 'active':
      return { isActive: true, isBanned: false };
    case 'inactive':
      return { isActive: false, isBanned: false };
    case 'banned':
      return { isBanned: true };
    default:
      return {};
  }
}

export function UsersContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { currentPage, pageSize, resetPage, getPaginationProps } = usePagination();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IAdminUserDataType | null>(null);

  // Build query params from filters
  const queryParams = {
    page: currentPage,
    limit: pageSize,
    search: searchQuery || undefined,
    ...resolveStatusParams(statusFilter),
  };

  // Fetch users list
  const { data: usersResponse, isLoading } = useAdminUsers(queryParams);

  const users = (usersResponse?.data.items ?? []) as IAdminUserDataType[];
  const totalUsers = usersResponse?.data.totalCount ?? 0;

  // Mutations
  const updateUserMutation = useUpdateUserAdmin();
  const banUserMutation = useBanUserAdmin();
  const createUserMutation = useCreateUserAdmin();

  // --- Handlers ---
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    resetPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetPage();
  };

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
    if (!selectedUser) return;
    updateUserMutation.mutate(
      {
        id: selectedUser.id,
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          username: data.username,
          isActive: data.isActive,
          isVerified: data.isVerified,
          isBanned: data.isBanned,
        },
      },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setSelectedUser(null);
        },
      },
    );
  };

  const confirmDelete = () => {
    // BE has no delete endpoint — no-op for now
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmBan = () => {
    if (!selectedUser) return;
    banUserMutation.mutate(
      { id: selectedUser.id, isBanned: !selectedUser.isBanned },
      {
        onSuccess: () => {
          setBanDialogOpen(false);
          setSelectedUser(null);
        },
      },
    );
  };

  const handleAddUser = (data: ICreateUserAdminPayload) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        setAddDialogOpen(false);
      },
    });
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
          roleFilter="all"
          onRoleChange={() => {}}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          roles={[]}
        />
      </div>

      {/* Table - takes remaining space and scrolls */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Đang tải dữ liệu...
          </div>
        ) : (
          <UsersTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBan={handleBan}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination
          {...getPaginationProps(totalUsers)}
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
        isPending={createUserMutation.isPending}
      />
    </div>
  );
}
