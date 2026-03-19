'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Eye,
  EyeOff,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  TabsUnderline,
  TabsUnderlineList,
  TabsUnderlineTrigger,
} from '@/components/ui/tabs-underline';
import {
  useAdminBannersQuery,
  useAdminBannerGroupQuery,
} from '@/hooks/querys/admin-banner.query';
import {
  useAddBannerToGroupMutation,
  useRemoveBannerFromGroupMutation,
  useReorderBannersInGroupMutation,
} from '@/hooks/mutations/admin-banner.mutation';
import type {
  IBannerGroupDataType,
  IBannerDataType,
  IBannerGroupMapping,
} from '@/lib/types/interfaces/apis/banner.interfaces';
import Image from 'next/image';
import { CreateBannerDialog } from './create-banner-dialog';
import { EditBannerInGroupDialog } from './edit-banner-in-group-dialog';
import { DeleteBannerDialog } from './delete-banner-dialog';
import { POSITION_LABELS, TYPE_LABELS } from '@/app/admin/banners/constants';

const PAGE_SIZE = 8;

interface ManageBannersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: IBannerGroupDataType | null;
}

export function ManageBannersDialog({
  open,
  onOpenChange,
  group,
}: ManageBannersDialogProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBannerDataType | null>(
    null,
  );
  const [deletingBanner, setDeletingBanner] = useState<IBannerDataType | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'in-group' | 'all'>('in-group');

  // Fetch detailed group data (to know which banners belong to this group)
  // staleTime: 0 để đảm bảo refetch ngay sau khi reorder
  const { data: groupDetailData, isLoading: isLoadingGroupDetail } =
    useAdminBannerGroupQuery(group?.id ?? '', {
      enabled: open && !!group?.id,
      staleTime: 0,
    });

  // Fetch all banners with pagination + search
  const { data: allBannersData, isLoading: isLoadingAllBanners } =
    useAdminBannersQuery(
      { page, limit: PAGE_SIZE, search: search || undefined },
      { enabled: open && activeTab === 'all' },
    );

  const groupDetail = groupDetailData?.data ?? group;

  // Get banners in group sorted by sortOrder
  const bannersInGroup = useMemo(() => {
    const mappings = groupDetail?.banners ?? [];
    return [...mappings].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [groupDetail?.banners]);

  // Set of banner IDs that currently belong to this group
  const groupBannerIdSet = useMemo<Set<string>>(
    () => new Set(bannersInGroup.map((b) => b.bannerId)),
    [bannersInGroup],
  );

  const allBanners: IBannerDataType[] = allBannersData?.data?.items ?? [];
  const totalCount = allBannersData?.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const addBannerToGroupMutation = useAddBannerToGroupMutation();
  const removeBannerFromGroupMutation = useRemoveBannerFromGroupMutation();
  const reorderBannersMutation = useReorderBannersInGroupMutation();

  const toggleBannerSelection = useCallback(
    async (bannerId: string) => {
      if (!group) return;
      const isCurrentlySelected = groupBannerIdSet.has(bannerId);
      if (isCurrentlySelected) {
        await removeBannerFromGroupMutation.mutateAsync({
          groupId: group.id,
          bannerId,
        });
      } else {
        await addBannerToGroupMutation.mutateAsync({
          groupId: group.id,
          bannerId,
        });
      }
    },
    [
      groupBannerIdSet,
      group,
      addBannerToGroupMutation,
      removeBannerFromGroupMutation,
    ],
  );

  // Move banner up in the sort order
  const handleMoveUp = useCallback(
    async (index: number) => {
      if (!group || index <= 0) return;

      // Lấy dữ liệu mới nhất từ groupDetail
      const currentBanners = groupDetail?.banners ?? [];
      if (currentBanners.length < 2) return;

      // Sắp xếp theo sortOrder hiện tại
      const sortedBanners = [...currentBanners].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );

      // Hoán đổi vị trí trong mảng
      const newOrder = [...sortedBanners];
      const temp = newOrder[index];
      newOrder[index] = newOrder[index - 1];
      newOrder[index - 1] = temp;

      // Tính lại sortOrder theo thứ tự 1, 2, 3... (đảm bảo không trùng lặp)
      const orderData = newOrder.map((item, i) => ({
        bannerId: item.bannerId,
        sortOrder: i + 1,
      }));

      await reorderBannersMutation.mutateAsync({
        groupId: group.id,
        orderData,
      });
    },
    [group, groupDetail?.banners, reorderBannersMutation],
  );

  // Move banner down in the sort order
  const handleMoveDown = useCallback(
    async (index: number) => {
      if (!group) return;

      // Lấy dữ liệu mới nhất từ groupDetail
      const currentBanners = groupDetail?.banners ?? [];
      if (currentBanners.length < 2 || index >= currentBanners.length - 1)
        return;

      // Sắp xếp theo sortOrder hiện tại
      const sortedBanners = [...currentBanners].sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );

      // Hoán đổi vị trí trong mảng
      const newOrder = [...sortedBanners];
      const temp = newOrder[index];
      newOrder[index] = newOrder[index + 1];
      newOrder[index + 1] = temp;

      // Tính lại sortOrder theo thứ tự 1, 2, 3... (đảm bảo không trùng lặp)
      const orderData = newOrder.map((item, i) => ({
        bannerId: item.bannerId,
        sortOrder: i + 1,
      }));

      await reorderBannersMutation.mutateAsync({
        groupId: group.id,
        orderData,
      });
    },
    [group, groupDetail?.banners, reorderBannersMutation],
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        setEditingBanner(null);
        setDeletingBanner(null);
        setSearch('');
        setPage(1);
        setActiveTab('in-group');
      }
      onOpenChange(newOpen);
    },
    [onOpenChange],
  );

  if (!group) return null;

  const groupBannerCount = bannersInGroup.length;
  const isLoading = isLoadingAllBanners || isLoadingGroupDetail;
  const isMutating =
    addBannerToGroupMutation.isPending ||
    removeBannerFromGroupMutation.isPending ||
    reorderBannersMutation.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className='sm:max-w-[1000px] max-h-[90vh] overflow-hidden p-0'>
          <DialogHeader className='px-6 pt-6 pb-2'>
            <DialogTitle>Quản lý banner – {group.name}</DialogTitle>
            <DialogDescription>
              Quản lý và sắp xếp thứ tự banner trong nhóm &ldquo;{group.name}
              &rdquo;
            </DialogDescription>
          </DialogHeader>

          <TabsUnderline
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'in-group' | 'all')}
            className='flex flex-col h-full gap-0'
          >
            {/* Tabs */}
            <div className='px-6'>
              <TabsUnderlineList className='justify-start gap-6'>
                <TabsUnderlineTrigger
                  value='in-group'
                  className='flex-none px-1'
                >
                  Banner trong nhóm ({groupBannerCount})
                </TabsUnderlineTrigger>
                <TabsUnderlineTrigger value='all' className='flex-none px-1'>
                  Tất cả banner
                </TabsUnderlineTrigger>
              </TabsUnderlineList>
            </div>

            {/* Toolbar */}
            <div className='px-6 py-3 border-b flex items-center justify-between bg-muted/30 gap-4'>
              {activeTab === 'all' ? (
                <>
                  <div className='flex items-center gap-4 flex-1'>
                    <div className='relative flex-1 max-w-xs'>
                      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                      <Input
                        placeholder='Tìm kiếm banner...'
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        className='pl-8 h-8 text-sm'
                      />
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='primary-pink'
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className='h-4 w-4 mr-1' />
                    Thêm banner mới
                  </Button>
                </>
              ) : (
                <div className='text-sm text-muted-foreground'>
                  Kéo hoặc dùng mũi tên để thay đổi thứ tự hiển thị
                </div>
              )}
            </div>

            {/* Content */}
            <div className='flex-1 px-6 py-3 overflow-auto max-h-[calc(90vh-280px)]'>
              {activeTab === 'in-group' ? (
                <BannersInGroupTable
                  bannersInGroup={bannersInGroup}
                  isLoading={isLoadingGroupDetail}
                  isMutating={isMutating}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onRemove={(bannerId) =>
                    group &&
                    removeBannerFromGroupMutation.mutate({
                      groupId: group.id,
                      bannerId,
                    })
                  }
                  onEdit={(banner) => setEditingBanner(banner)}
                />
              ) : (
                <BannerSelectionTable
                  allBanners={allBanners}
                  groupBannerIdSet={groupBannerIdSet}
                  onToggleSelection={toggleBannerSelection}
                  isLoading={isLoading}
                  isMutating={isMutating}
                  onEdit={setEditingBanner}
                  onDelete={setDeletingBanner}
                />
              )}
            </div>

            {/* Pagination + Footer */}
            <div className='px-6 py-3 border-t flex items-center justify-between bg-muted/30'>
              {activeTab === 'all' ? (
                <>
                  <div className='text-sm text-muted-foreground'>
                    Trang {page} / {totalPages} &nbsp;·&nbsp; {totalCount}{' '}
                    banner
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || isLoading}
                    >
                      <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-8 w-8'
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page >= totalPages || isLoading}
                    >
                      <ChevronRight className='h-4 w-4' />
                    </Button>
                    <Separator orientation='vertical' className='h-4' />
                    <Button
                      variant='outline'
                      onClick={() => handleOpenChange(false)}
                    >
                      Đóng
                    </Button>
                  </div>
                </>
              ) : (
                <div className='flex items-center justify-end w-full gap-2'>
                  <Button
                    variant='outline'
                    onClick={() => handleOpenChange(false)}
                  >
                    Đóng
                  </Button>
                </div>
              )}
            </div>
          </TabsUnderline>
        </DialogContent>
      </Dialog>

      <CreateBannerDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        groupId={group.id}
      />

      <EditBannerInGroupDialog
        open={!!editingBanner}
        onOpenChange={(isOpen) => !isOpen && setEditingBanner(null)}
        banner={editingBanner}
        groupId={group.id}
      />

      <DeleteBannerDialog
        open={!!deletingBanner}
        onOpenChange={(isOpen) => !isOpen && setDeletingBanner(null)}
        banner={deletingBanner}
      />
    </>
  );
}

// ── Banners In Group Table ────────────────────────────────────────────────────

interface BannersInGroupTableProps {
  bannersInGroup: IBannerGroupMapping[];
  isLoading: boolean;
  isMutating: boolean;
  onMoveUp: (index: number) => Promise<void>;
  onMoveDown: (index: number) => Promise<void>;
  onRemove: (bannerId: string) => void;
  onEdit: (banner: IBannerDataType) => void;
}

function BannersInGroupTable({
  bannersInGroup,
  isLoading,
  isMutating,
  onMoveUp,
  onMoveDown,
  onRemove,
  onEdit,
}: BannersInGroupTableProps) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-10'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (bannersInGroup.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-10 text-muted-foreground gap-3'>
        <ImageIcon className='h-10 w-10' />
        <p>Chưa có banner nào trong nhóm</p>
        <p className='text-sm'>
          Chuyển sang tab &ldquo;Tất cả banner&rdquo; để thêm
        </p>
      </div>
    );
  }

  return (
    <div className='rounded-md border overflow-x-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[60px]'>Thứ tự</TableHead>
            <TableHead className='w-20'>Hình ảnh</TableHead>
            <TableHead className='min-w-[150px]'>Tiêu đề</TableHead>
            <TableHead className='w-[100px]'>Loại</TableHead>
            <TableHead className='w-[140px]'>Vị trí</TableHead>
            <TableHead className='w-[90px]'>Trạng thái</TableHead>
            <TableHead className='text-right w-[140px]'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bannersInGroup.map((mapping, index) => {
            const banner = mapping.banner;
            if (!banner) return null;

            return (
              <TableRow key={mapping.bannerId}>
                <TableCell>
                  <div className='flex items-center gap-1'>
                    <GripVertical className='h-4 w-4 text-muted-foreground' />
                    <span className='font-medium'>{mapping.sortOrder}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {(banner.imageUrl ?? banner.imageMedia?.url) ? (
                    <Image
                      width={64}
                      height={40}
                      src={(banner.imageUrl ?? banner.imageMedia?.url)!}
                      alt={banner.title ?? 'Banner'}
                      className='h-10 w-16 object-cover rounded-md'
                    />
                  ) : (
                    <div className='h-10 w-16 bg-muted rounded-md flex items-center justify-center'>
                      <ImageIcon className='h-4 w-4 text-muted-foreground' />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-medium truncate max-w-[180px]'>
                      {banner.title ?? 'Không có tiêu đề'}
                    </span>
                    {banner.badge && (
                      <span className='text-xs text-muted-foreground'>
                        {banner.badge}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={banner.type === 'IMAGE' ? 'default' : 'secondary'}
                  >
                    {TYPE_LABELS[banner.type] ?? banner.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>
                    {POSITION_LABELS[banner.position] ?? banner.position}
                  </Badge>
                </TableCell>
                <TableCell>
                  {banner.isActive ? (
                    <div className='flex items-center gap-1 text-green-600'>
                      <Eye className='h-3.5 w-3.5' />
                      <span className='text-xs'>Hiện</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1 text-muted-foreground'>
                      <EyeOff className='h-3.5 w-3.5' />
                      <span className='text-xs'>Ẩn</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onMoveUp(index)}
                      disabled={index === 0 || isMutating}
                      aria-label='Di chuyển lên'
                    >
                      <ChevronUp className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onMoveDown(index)}
                      disabled={
                        index === bannersInGroup.length - 1 || isMutating
                      }
                      aria-label='Di chuyển xuống'
                    >
                      <ChevronDown className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(banner)}
                      aria-label='Chỉnh sửa'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onRemove(mapping.bannerId)}
                      disabled={isMutating}
                      aria-label='Xóa khỏi nhóm'
                      className='text-destructive hover:text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Banner Selection Table ────────────────────────────────────────────────────

interface BannerSelectionTableProps {
  allBanners: IBannerDataType[];
  groupBannerIdSet: Set<string>;
  onToggleSelection: (bannerId: string) => Promise<void>;
  isLoading: boolean;
  isMutating: boolean;
  onEdit: (banner: IBannerDataType) => void;
  onDelete: (banner: IBannerDataType) => void;
}

function BannerSelectionTable({
  allBanners,
  groupBannerIdSet,
  onToggleSelection,
  isLoading,
  isMutating,
  onEdit,
  onDelete,
}: BannerSelectionTableProps) {
  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-10'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (allBanners.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-10 text-muted-foreground gap-3'>
        <ImageIcon className='h-10 w-10' />
        <p>Chưa có banner nào trong hệ thống</p>
      </div>
    );
  }

  return (
    <div className='rounded-md border overflow-x-auto'>
      <Table className='min-w-max'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>Chọn</TableHead>
            <TableHead className='w-20'>Hình ảnh</TableHead>
            <TableHead className='min-w-[150px]'>Tiêu đề</TableHead>
            <TableHead className='w-[100px]'>Loại</TableHead>
            <TableHead className='w-[140px]'>Vị trí</TableHead>
            <TableHead className='w-[90px]'>Trạng thái</TableHead>
            <TableHead className='text-right w-[90px]'>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allBanners.map((banner) => {
            const isSelected = groupBannerIdSet.has(banner.id);

            return (
              <TableRow
                key={banner.id}
                className={isSelected ? 'bg-primary/5' : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => void onToggleSelection(banner.id)}
                    disabled={isMutating}
                    aria-label={`Chọn banner ${banner.title ?? 'không có tiêu đề'}`}
                  />
                </TableCell>
                <TableCell>
                  {(banner.imageUrl ?? banner.imageMedia?.url) ? (
                    <Image
                      width={64}
                      height={40}
                      src={(banner.imageUrl ?? banner.imageMedia?.url)!}
                      alt={banner.title ?? 'Banner'}
                      className='h-10 w-16 object-cover rounded-md'
                    />
                  ) : (
                    <div className='h-10 w-16 bg-muted rounded-md flex items-center justify-center'>
                      <ImageIcon className='h-4 w-4 text-muted-foreground' />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-medium truncate max-w-[180px]'>
                      {banner.title ?? 'Không có tiêu đề'}
                    </span>
                    {banner.badge && (
                      <span className='text-xs text-muted-foreground'>
                        {banner.badge}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={banner.type === 'IMAGE' ? 'default' : 'secondary'}
                  >
                    {TYPE_LABELS[banner.type] ?? banner.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>
                    {POSITION_LABELS[banner.position] ?? banner.position}
                  </Badge>
                </TableCell>
                <TableCell>
                  {banner.isActive ? (
                    <div className='flex items-center gap-1 text-green-600'>
                      <Eye className='h-3.5 w-3.5' />
                      <span className='text-xs'>Hiện</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-1 text-muted-foreground'>
                      <EyeOff className='h-3.5 w-3.5' />
                      <span className='text-xs'>Ẩn</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex items-center justify-end gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onEdit(banner)}
                      aria-label='Chỉnh sửa'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => onDelete(banner)}
                      aria-label='Xóa'
                      className='text-destructive hover:text-destructive'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
