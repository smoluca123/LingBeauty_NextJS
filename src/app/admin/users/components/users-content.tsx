'use client';

import { useState, useCallback, useMemo } from 'react';
import { Ban, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TablePagination } from '@/app/admin/components';
import {
  IAdminUserDataType,
  UserSortBy,
  UserSortOrder,
} from '@/lib/types/interfaces/apis/admin-user.interfaces';
import {
  useAdminUsersQuery,
  useAdminUserRolesQuery,
  useBanUserMutation,
  useBanUserBulkMutation,
  useUpdateUserByAdminMutation,
  useCreateUserMutation,
} from '@/hooks/querys/admin-user.query';
import { UsersFilters } from './users-filters';
import { UsersTable } from './users-table';
import { DeleteUserDialog } from './delete-user-dialog';
import { BanUserDialog } from './ban-user-dialog';
import { EditUserDialog, UserFormData } from './edit-user-dialog';
import { AddUserDialog } from './add-user-dialog';

// ============ Constants ============

const DEFAULT_PAGE_SIZE = 10;

// ============ Component ============

export function UsersContent() {
  // ── Filter state ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'banned'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortBy, setSortBy] = useState<UserSortBy>('createdAt');
  const [order, setOrder] = useState<UserSortOrder>('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);

  // ── Selection state ────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banDialogOpen, setBanDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IAdminUserDataType | null>(null);

  // ── Derive BE params from filter state ───────────────────────────────────
  const isActive =
    statusFilter === 'active' ? true
    : statusFilter === 'inactive' ? false
    : undefined;

  const isBanned =
    statusFilter === 'banned' ? true
    : statusFilter === 'active' || statusFilter === 'inactive' ? false
    : undefined;

  const isVerified =
    verifiedFilter === 'verified' ? true
    : verifiedFilter === 'unverified' ? false
    : undefined;

  // ── Queries ───────────────────────────────────────────────────────────────
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsersQuery({
    search: search || undefined,
    isActive,
    isBanned,
    isVerified,
    sortBy,
    order,
    page,
    limit,
  });

  const { data: rolesData } = useAdminUserRolesQuery();

  // ── Mutations ─────────────────────────────────────────────────────────────
  const banMutation = useBanUserMutation();
  const banBulkMutation = useBanUserBulkMutation();
  const updateMutation = useUpdateUserByAdminMutation();
  const createMutation = useCreateUserMutation();

  // ── Derived data ──────────────────────────────────────────────────────────
  const users = useMemo(() => usersData?.data?.items ?? [], [usersData?.data?.items]);
  const totalCount = usersData?.data?.totalCount ?? 0;
  const totalPage = usersData?.data?.totalPage ?? 1;
  const roles = rolesData?.data ?? [];

  // ── Filter/sort/page reset helpers ────────────────────────────────────────
  const resetPage = () => setPage(1);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetPage();
  };

  const handleStatusChange = (value: 'all' | 'active' | 'inactive' | 'banned') => {
    setStatusFilter(value);
    resetPage();
  };

  const handleVerifiedChange = (value: 'all' | 'verified' | 'unverified') => {
    setVerifiedFilter(value);
    resetPage();
  };

  const handleSortByChange = (value: UserSortBy) => {
    setSortBy(value);
    resetPage();
  };

  const handleOrderChange = (value: UserSortOrder) => {
    setOrder(value);
    resetPage();
  };

  const handlePageSizeChange = (size: number) => {
    setLimit(size);
    resetPage();
  };

  // ── Selection handlers ────────────────────────────────────────────────────
  const handleToggleSelect = useCallback((userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    const allSelected = users.every((u) => selectedIds.has(u.id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  }, [users, selectedIds]);

  const clearSelection = () => setSelectedIds(new Set());

  // ── Bulk Ban handlers ─────────────────────────────────────────────────────
  const handleBulkBan = (newBanState: boolean) => {
    const items = Array.from(selectedIds).map((userId) => ({
      userId,
      isBanned: newBanState,
    }));
    banBulkMutation.mutate(items, {
      onSuccess: () => clearSelection(),
    });
  };

  // ── Single dialog handlers ────────────────────────────────────────────────
  const handleEdit = (user: IAdminUserDataType) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: IAdminUserDataType) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleBan = (user: IAdminUserDataType) => {
    setSelectedUser(user);
    setBanDialogOpen(true);
  };

  const confirmBan = () => {
    if (!selectedUser) return;
    banMutation.mutate(
      { userId: selectedUser.id, isBanned: !selectedUser.isBanned },
      {
        onSuccess: () => {
          setBanDialogOpen(false);
          setSelectedUser(null);
        },
      },
    );
  };

  const confirmDelete = () => {
    // TODO: implement delete API when BE provides endpoint
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveEdit = (data: UserFormData) => {
    if (!selectedUser) return;
    updateMutation.mutate(
      {
        userId: selectedUser.id,
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          username: data.username,
          roleIds: data.roleIds,
          isActive: data.isActive,
          isVerified: data.isVerified,
          isBanned: data.isBanned,
          isEmailVerified: data.isEmailVerified,
          isPhoneVerified: data.isPhoneVerified,
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

  const handleAddUser = (data: UserFormData) => {
    createMutation.mutate(
      {
        email: data.email,
        password: data.password ?? '',
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        username: data.username,
        roleId: data.roleIds[0],          // BE chỉ hỗ trợ 1 roleId khi tạo
        isActive: data.isActive ?? true,
        isEmailVerified: data.isEmailVerified ?? false,
        isPhoneVerified: data.isPhoneVerified ?? false,
      },
      {
        onSuccess: () => {
          setAddDialogOpen(false);
        },
      },
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-4 md:gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Người dùng</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} variant="primary-pink" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      {/* Filters */}
      <div className="shrink-0">
        <UsersFilters
          searchQuery={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          verifiedFilter={verifiedFilter}
          onVerifiedChange={handleVerifiedChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          order={order}
          onOrderChange={handleOrderChange}
          roles={roles}
        />
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="shrink-0 flex flex-wrap items-center gap-2 sm:gap-3 rounded-lg border bg-muted/50 px-4 py-3">
          <Badge variant="secondary" className="text-sm">
            Đã chọn {selectedIds.size} người dùng
          </Badge>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
              disabled={banBulkMutation.isPending}
              onClick={() => handleBulkBan(true)}
            >
              <Ban className="mr-1.5 h-3.5 w-3.5" />
              <span className="hidden xs:inline">Cấm tất cả</span>
              <span className="xs:hidden">Cấm</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
              disabled={banBulkMutation.isPending}
              onClick={() => handleBulkBan(false)}
            >
              <span className="hidden xs:inline">Bỏ cấm tất cả</span>
              <span className="xs:hidden">Bỏ cấm</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              aria-label="Bỏ chọn tất cả"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 min-h-0">
        <UsersTable
          users={users}
          isLoading={isUsersLoading}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBan={handleBan}
        />
      </div>

      {/* Pagination */}
      <div className="shrink-0">
        <TablePagination
          currentPage={page}
          totalPages={totalPage}
          pageSize={limit}
          totalItems={totalCount}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
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
        availableRoles={roles}
      />

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddUser}
        availableRoles={roles}
      />
    </div>
  );
}
