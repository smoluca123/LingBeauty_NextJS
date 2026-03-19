'use client';

import { useState } from 'react';
import { Loader2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

export function BannersContent() {
  const [page, setPage] = useState(1);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBannerDataType | null>(null);

  const { data: groupsData, isLoading: isLoadingGroups } = useAdminBannerGroupsQuery({
    limit: 100, // Groups needed for filter dropdown — usually small set
  });

  const { data: bannersData, isLoading: isLoadingBanners } = useAdminBannersQuery({
    page,
    limit: PAGE_SIZE,
    search: searchQuery || undefined,
    groupId: selectedGroupId ?? undefined,
  });

  const groups: IBannerGroupDataType[] =
    (groupsData as IApiPaginationResponseWrapperType<IBannerGroupDataType> | undefined)?.data?.items ?? [];
  const bannersResult = bannersData as IApiPaginationResponseWrapperType<IBannerDataType> | undefined;
  const banners: IBannerDataType[] = bannersResult?.data?.items ?? [];
  const totalCount: number = bannersResult?.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Build groupId → groupName lookup
  const groupNameMap = new Map<string, string>(groups.map((g) => [g.id, g.name]));

  // Enrich banners with group info (derived during render — no useEffect)
  const enrichedBanners = banners.map((banner) => {
    const firstGroup = banner.groups?.[0];
    const groupId = firstGroup?.bannerGroupId ?? '';
    return {
      ...banner,
      groupId,
      groupName: groupNameMap.get(groupId) ?? '—',
    };
  });

  const isLoading = isLoadingGroups || isLoadingBanners;

  // Get fresh selected banner data from cache
  const currentSelectedBanner = selectedBanner
    ? (enrichedBanners.find((b) => b.id === selectedBanner.id) ?? selectedBanner)
    : null;

  const handleGroupChange = (groupId: string | null) => {
    setSelectedGroupId(groupId);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleEdit = (banner: IBannerDataType & { groupId?: string }) => {
    setSelectedBanner(banner);
    setEditDialogOpen(true);
  };

  const handleDelete = (banner: IBannerDataType & { groupId?: string }) => {
    setSelectedBanner(banner);
    setDeleteDialogOpen(true);
  };

  return (
    <div className='flex flex-col h-full gap-4 md:gap-6 w-full min-w-0'>
      <BannersHeader
        groups={groups}
        selectedGroupId={selectedGroupId}
        onGroupChange={handleGroupChange}
        onSearch={handleSearch}
        onAddBanner={() => setCreateDialogOpen(true)}
      />

      {/* Loading state */}
      {isLoading && (
        <div className='flex items-center justify-center py-20 w-full'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      )}

      {/* Empty state – no groups */}
      {!isLoading && groups.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full'>
          <ImageIcon className='h-12 w-12' />
          <p className='text-lg font-medium'>Chưa có nhóm banner nào</p>
          <p className='text-sm'>Vui lòng tạo nhóm banner trước khi thêm banner</p>
        </div>
      )}

      {/* Empty state – no banners */}
      {!isLoading && groups.length > 0 && enrichedBanners.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 w-full'>
          <ImageIcon className='h-12 w-12' />
          <p className='text-lg font-medium'>Chưa có banner nào</p>
          <p className='text-sm'>
            {searchQuery
              ? `Không tìm thấy banner nào khớp với "${searchQuery}"`
              : 'Nhấn \u201cThêm banner\u201d để tạo banner đầu tiên'}
          </p>
        </div>
      )}

      {/* Banner Table */}
      {!isLoading && enrichedBanners.length > 0 && (
        <div className='flex flex-col gap-4 flex-1 min-h-0 w-full overflow-hidden'>
          <BannerTable banners={enrichedBanners} onEdit={handleEdit} onDelete={handleDelete} />

          {/* Pagination */}
          <div className='flex items-center justify-between px-1'>
            <p className='text-sm text-muted-foreground'>
              Hiển thị{' '}
              <span className='font-medium'>
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)}
              </span>{' '}
              trong <span className='font-medium'>{totalCount}</span> banner
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

      <CreateBannerDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        groups={groups}
        defaultGroupId={selectedGroupId}
      />

      <EditBannerDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        banner={currentSelectedBanner}
        groups={groups}
      />

      <DeleteBannerDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        banner={currentSelectedBanner}
      />
    </div>
  );
}
