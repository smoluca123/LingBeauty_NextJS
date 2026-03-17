'use client';

import { useState } from 'react';
import { Loader2, ImageIcon } from 'lucide-react';
import { useAdminBannerGroupsQuery } from '@/hooks/querys/admin-banner.query';
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { BannerGroupsHeader } from './banner-groups-header';
import {
  BannerGroupTable,
  CreateBannerGroupDialog,
  EditBannerGroupDialog,
  DeleteBannerGroupDialog,
  ManageBannersDialog,
} from './banner-group-table';

export function BannerGroupsContent() {
  const { data, isLoading, isError } = useAdminBannerGroupsQuery({ limit: 50 });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manageBannersDialogOpen, setManageBannersDialogOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] =
    useState<IBannerGroupDataType | null>(null);

  const result = data as
    | IApiPaginationResponseWrapperType<IBannerGroupDataType>
    | undefined;
  const groups = result?.data?.items ?? [];

  // Always use the latest group data from the cache/query
  const currentSelectedGroup = selectedGroup
    ? groups.find((g) => g.id === selectedGroup.id) || null
    : null;

  const handleAddNew = () => {
    setCreateDialogOpen(true);
  };

  const handleEdit = (group: IBannerGroupDataType) => {
    setSelectedGroup(group);
    setEditDialogOpen(true);
  };

  const handleDelete = (group: IBannerGroupDataType) => {
    setSelectedGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleManageBanners = (group: IBannerGroupDataType) => {
    setSelectedGroup(group);
    setManageBannersDialogOpen(true);
  };

  return (
    <div className='flex flex-col h-full gap-4 md:gap-6 w-full min-w-0'>
      <BannerGroupsHeader onAddGroup={handleAddNew} />

      {/* Loading state */}
      {isLoading && (
        <div className='flex items-center justify-center py-20 w-full'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className='flex items-center justify-center py-20 text-destructive w-full'>
          Lỗi khi tải danh sách nhóm banner. Vui lòng thử lại.
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && groups.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full'>
          <ImageIcon className='h-12 w-12' />
          <p className='text-lg font-medium'>Chưa có nhóm banner nào</p>
          <p className='text-sm'>
            Nhấn &ldquo;Thêm nhóm banner&rdquo; để tạo nhóm đầu tiên
          </p>
        </div>
      )}

      {/* Banner Group Table */}
      {!isLoading && !isError && groups.length > 0 && (
        <div className='flex-1 min-h-0'>
          <BannerGroupTable
            groups={groups}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageBanners={handleManageBanners}
          />
        </div>
      )}

      {/* Create Dialog */}
      <CreateBannerGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Edit Dialog */}
      <EditBannerGroupDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        group={currentSelectedGroup}
      />

      {/* Delete Dialog */}
      <DeleteBannerGroupDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        group={currentSelectedGroup}
      />

      {/* Manage Banners Dialog */}
      <ManageBannersDialog
        open={manageBannersDialogOpen}
        onOpenChange={setManageBannersDialogOpen}
        group={currentSelectedGroup}
      />
    </div>
  );
}
