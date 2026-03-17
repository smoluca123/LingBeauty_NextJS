'use client';

import { useState, useMemo } from 'react';
import { Loader2, ImageIcon } from 'lucide-react';
import {
  useAdminBannerGroupsQuery,
  useAdminBannersQuery,
} from '@/hooks/querys/admin-banner.query';
import type {
  IBannerGroupDataType,
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { BannersHeader } from './banners-header';
import {
  BannerTable,
  CreateBannerDialog,
  EditBannerDialog,
  DeleteBannerDialog,
} from './banner-table';

export function BannersContent() {
  const { data: groupsData, isLoading: isLoadingGroups } =
    useAdminBannerGroupsQuery({ limit: 100 });

  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBannerDataType | null>(
    null,
  );

  // Fetch banners using the new API
  const { data: bannersData, isLoading: isLoadingBanners } =
    useAdminBannersQuery({
      limit: 100,
      groupId: selectedGroupId || undefined,
    });

  const groupsResult = groupsData as
    | IApiPaginationResponseWrapperType<IBannerGroupDataType>
    | undefined;
  const groups = useMemo(() => groupsResult?.data?.items ?? [], [groupsResult?.data?.items]);

  const bannersResult = bannersData as
    | IApiPaginationResponseWrapperType<IBannerDataType>
    | undefined;
  const banners = useMemo(() => bannersResult?.data?.items ?? [], [bannersResult?.data?.items]);

  // Create a map of groupId -> groupName for quick lookup
  const groupMap = useMemo(() => {
    const map = new Map<string, string>();
    groups.forEach((group) => {
      map.set(group.id, group.name);
    });
    return map;
  }, [groups]);

  // Enrich banners with group info
  const allBanners = useMemo(() => {
    return banners.map((banner) => {
      // Get the first group mapping if exists
      const firstGroup = banner.groups?.[0];
      const groupId = firstGroup?.bannerGroupId || '';
      const groupName = groupMap.get(groupId) || '—';

      return {
        ...banner,
        groupId,
        groupName,
      };
    });
  }, [banners, groupMap]);

  const isLoading = isLoadingGroups || isLoadingBanners;

  const handleAddBanner = () => {
    setCreateDialogOpen(true);
  };

  const handleEdit = (banner: IBannerDataType & { groupId?: string }) => {
    setSelectedBanner(banner);
    setEditDialogOpen(true);
  };

  const handleDelete = (banner: IBannerDataType & { groupId?: string }) => {
    setSelectedBanner(banner);
    setDeleteDialogOpen(true);
  };

  // Get current selected banner from fresh data
  const currentSelectedBanner = selectedBanner
    ? allBanners.find((b) => b.id === selectedBanner.id) || null
    : null;

  return (
    <div className='flex flex-col h-full gap-4 md:gap-6 w-full min-w-0'>
      <BannersHeader
        groups={groups}
        selectedGroupId={selectedGroupId}
        onGroupChange={setSelectedGroupId}
        onAddBanner={handleAddBanner}
      />

      {/* Loading state */}
      {isLoading && (
        <div className='flex items-center justify-center py-20 w-full'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      )}

      {/* Empty state - no groups */}
      {!isLoading && groups.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full'>
          <ImageIcon className='h-12 w-12' />
          <p className='text-lg font-medium'>Chưa có nhóm banner nào</p>
          <p className='text-sm'>
            Vui lòng tạo nhóm banner trước khi thêm banner
          </p>
        </div>
      )}

      {/* Empty state - no banners */}
      {!isLoading && groups.length > 0 && allBanners.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full'>
          <ImageIcon className='h-12 w-12' />
          <p className='text-lg font-medium'>Chưa có banner nào</p>
          <p className='text-sm'>
            Nhấn &ldquo;Thêm banner&rdquo; để tạo banner đầu tiên
          </p>
        </div>
      )}

      {/* Banner Table */}
      {!isLoading && allBanners.length > 0 && (
        <div className='flex-1 min-h-0'>
          <BannerTable
            banners={allBanners}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Create Dialog */}
      <CreateBannerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        groups={groups}
        defaultGroupId={selectedGroupId}
      />

      {/* Edit Dialog */}
      <EditBannerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        banner={currentSelectedBanner}
        groups={groups}
      />

      {/* Delete Dialog */}
      <DeleteBannerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        banner={currentSelectedBanner}
      />
    </div>
  );
}
