'use client';

import { useState } from 'react';
import { Loader2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

export function BannerGroupsContent() {
  const [page, setPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manageBannersDialogOpen, setManageBannersDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<IBannerGroupDataType | null>(null);

  const { data, isLoading, isError } = useAdminBannerGroupsQuery({
    page,
    limit: PAGE_SIZE,
  });

  const result = data as IApiPaginationResponseWrapperType<IBannerGroupDataType> | undefined;
  const groups = result?.data?.items ?? [];
  const totalCount = result?.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Always use latest group data from cache for dialogs
  const currentSelectedGroup = selectedGroup
    ? (groups.find((g) => g.id === selectedGroup.id) ?? selectedGroup)
    : null;

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
      <BannerGroupsHeader onAddGroup={() => setCreateDialogOpen(true)} />

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
        <div className='flex flex-col gap-4 flex-1 min-h-0 w-full overflow-hidden'>
          <BannerGroupTable
            groups={groups}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onManageBanners={handleManageBanners}
          />

          {/* Pagination */}
          <div className='flex items-center justify-between px-1'>
            <p className='text-sm text-muted-foreground'>
              Hiển thị{' '}
              <span className='font-medium'>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)}
              </span>{' '}
              trong <span className='font-medium'>{totalCount}</span> nhóm
            </p>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeft className='h-4 w-4' />
                Trước
              </Button>
              <span className='text-sm text-muted-foreground px-1'>
                Trang {page} / {totalPages}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
              >
                Tiếp
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      )}

      <CreateBannerGroupDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <EditBannerGroupDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        group={currentSelectedGroup}
      />

      <DeleteBannerGroupDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        group={currentSelectedGroup}
      />

      <ManageBannersDialog
        open={manageBannersDialogOpen}
        onOpenChange={setManageBannersDialogOpen}
        group={currentSelectedGroup}
      />
    </div>
  );
}
