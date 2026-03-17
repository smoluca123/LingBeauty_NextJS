'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Loader2,
  Plus,
  Trash2,
  Info,
  ImageIcon,
  FolderTree,
  Inbox,
  LayoutList,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useUpdateBannerGroupMutation,
  useAddBannerToGroupMutation,
  useRemoveBannerFromGroupMutation,
} from '@/hooks/mutations/admin-banner.mutation';
import {
  useAdminBannersQuery,
  useAdminBannerGroupQuery,
} from '@/hooks/querys/admin-banner.query';
import type {
  IBannerGroupDataType,
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên nhóm'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  description: z.string().optional(),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBannerGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: IBannerGroupDataType | null;
}

export function EditBannerGroupDialog({
  open,
  onOpenChange,
  group,
}: EditBannerGroupDialogProps) {
  const [activeTab, setActiveTab] = useState('info');

  // Reset tab when dialog opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setActiveTab('info');
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] p-0 gap-0'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <DialogTitle className='text-xl'>Chỉnh sửa nhóm banner</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin nhóm &ldquo;{group?.name || 'Không có tên'}
            &rdquo;
          </DialogDescription>
        </DialogHeader>

        {group && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <div className='px-6'>
              <TabsList className='grid w-full grid-cols-2 h-11'>
                <TabsTrigger value='info' className='gap-2 text-sm'>
                  <LayoutList className='h-4 w-4' />
                  Thông tin Nhóm
                </TabsTrigger>
                <TabsTrigger value='banners' className='gap-2 text-sm'>
                  <ImageIcon className='h-4 w-4' />
                  Quản lý Banner
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='info' className='mt-0 m-0'>
              <ScrollArea className='h-[calc(90vh-180px)]'>
                <div className='px-6 pb-6 pt-4'>
                  <BannerGroupInfoTab
                    group={group}
                    onClose={() => onOpenChange(false)}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value='banners' className='mt-0 m-0'>
              <ScrollArea className='h-[calc(90vh-180px)]'>
                <div className='px-6 pb-6 pt-4'>
                  <BannerManagementTab group={group} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==================== TAB 1: BANNER GROUP INFO ====================

function BannerGroupInfoTab({
  group,
  onClose,
}: {
  group: IBannerGroupDataType;
  onClose: () => void;
}) {
  const updateMutation = useUpdateBannerGroupMutation();

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: group.name ?? '',
      slug: group.slug ?? '',
      description: group.description ?? '',
      isActive: group.isActive ?? true,
      startDate: group.startDate ? group.startDate.split('T')[0] : '',
      endDate: group.endDate ? group.endDate.split('T')[0] : '',
    },
  });

  // Reset form when group changes
  useEffect(() => {
    form.reset({
      name: group.name ?? '',
      slug: group.slug ?? '',
      description: group.description ?? '',
      isActive: group.isActive ?? true,
      startDate: group.startDate ? group.startDate.split('T')[0] : '',
      endDate: group.endDate ? group.endDate.split('T')[0] : '',
    });
  }, [group, form]);

  const onSubmit = async (data: FormValues) => {
    await updateMutation.mutateAsync({
      id: group.id,
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        isActive: data.isActive,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
      },
    });

    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* Name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên nhóm <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder='VD: Banner Tết 2026' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name='slug'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Slug <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder='VD: tet-2026' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Mô tả về nhóm banner này...'
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Range */}
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='startDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl>
                  <Input {...field} type='date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='endDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl>
                  <Input {...field} type='date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Active Status */}
        <FormField
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
              <div className='space-y-0.5'>
                <FormLabel className='text-base'>
                  Trạng thái hoạt động
                </FormLabel>
                <div className='text-sm text-muted-foreground'>
                  Nhóm banner sẽ được hiển thị khi được kích hoạt
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter className='pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button type='submit' disabled={updateMutation.isPending}>
            {updateMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ==================== TAB 2: BANNER MANAGEMENT ====================

function BannerManagementTab({ group }: { group: IBannerGroupDataType }) {
  const [selectedBannerId, setSelectedBannerId] = useState<string>('');

  // Get all banners
  const { data: bannersData, isLoading: isLoadingBanners } =
    useAdminBannersQuery({
      limit: 100,
    });

  // Get group details with banners
  const { data: groupData, isLoading: isLoadingGroup } =
    useAdminBannerGroupQuery(group.id);

  const addToGroupMutation = useAddBannerToGroupMutation();
  const removeFromGroupMutation = useRemoveBannerFromGroupMutation();

  const allBanners: IBannerDataType[] = useMemo(
    () => bannersData?.data?.items ?? [],
    [bannersData?.data?.items],
  );

  const groupBanners = useMemo(
    () => groupData?.data?.banners ?? [],
    [groupData?.data?.banners],
  );

  const availableBanners = useMemo(() => {
    const currentBannerIds = new Set(groupBanners.map((b) => b.bannerId));
    return allBanners.filter(
      (b: IBannerDataType) => !currentBannerIds.has(b.id),
    );
  }, [allBanners, groupBanners]);

  const handleAddToGroup = useCallback(async () => {
    if (!selectedBannerId) return;
    await addToGroupMutation.mutateAsync({
      bannerId: selectedBannerId,
      groupId: group.id,
    });
    setSelectedBannerId('');
  }, [selectedBannerId, group.id, addToGroupMutation]);

  const handleRemoveFromGroup = useCallback(
    async (bannerId: string) => {
      await removeFromGroupMutation.mutateAsync({
        bannerId,
        groupId: group.id,
      });
    },
    [group.id, removeFromGroupMutation],
  );

  const isLoading = isLoadingBanners || isLoadingGroup;
  const isMutating =
    addToGroupMutation.isPending || removeFromGroupMutation.isPending;

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-32 w-full' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Stats */}
      <div className='grid grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Tổng banner</CardDescription>
            <CardTitle className='text-2xl'>{groupBanners.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Banner khả dụng</CardDescription>
            <CardTitle className='text-2xl'>
              {availableBanners.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Trạng thái</CardDescription>
            <CardTitle className='text-lg'>
              {group.isActive ? (
                <Badge variant='default' className='bg-green-500'>
                  Đang hoạt động
                </Badge>
              ) : (
                <Badge variant='secondary'>Đã tắt</Badge>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Separator />

      {/* Add to group */}
      <div className='space-y-3'>
        <h4 className='text-sm font-medium flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Thêm banner vào nhóm
        </h4>
        <div className='flex gap-2'>
          <Select value={selectedBannerId} onValueChange={setSelectedBannerId}>
            <SelectTrigger className='flex-1'>
              <SelectValue placeholder='Chọn banner để thêm...' />
            </SelectTrigger>
            <SelectContent>
              {availableBanners.length === 0 ? (
                <div className='p-2 text-sm text-muted-foreground text-center'>
                  Không có banner nào khả dụng
                </div>
              ) : (
                availableBanners.map((banner: IBannerDataType) => (
                  <SelectItem key={banner.id} value={banner.id}>
                    {banner.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddToGroup}
            disabled={
              !selectedBannerId || addToGroupMutation.isPending || isMutating
            }
          >
            {addToGroupMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Thêm
          </Button>
        </div>
      </div>

      <Separator />

      {/* Current banners list */}
      <div className='space-y-3'>
        <h4 className='text-sm font-medium flex items-center gap-2'>
          <FolderTree className='h-4 w-4' />
          Các banner hiện tại
        </h4>

        {groupBanners.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-muted-foreground border rounded-lg'>
            <Inbox className='h-10 w-10 mb-2 opacity-50' />
            <p className='text-sm'>Nhóm chưa có banner nào</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {groupBanners.map((item) => (
              <Card key={item.id} className='overflow-hidden'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {item.banner.imageMedia?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.banner.imageMedia.url || undefined}
                          alt={item.banner.title || ''}
                          className='w-16 h-16 object-cover rounded-md'
                        />
                      ) : (
                        <div className='w-16 h-16 bg-muted rounded-md flex items-center justify-center'>
                          <ImageIcon className='h-6 w-6 text-muted-foreground' />
                        </div>
                      )}
                      <div className='flex flex-col'>
                        <span className='font-medium'>{item.banner.title}</span>
                        <span className='text-xs text-muted-foreground'>
                          Vị trí: {getPositionLabel(item.banner.position)} | Thứ
                          tự: {item.sortOrder}
                        </span>
                      </div>
                      {item.banner.isActive ? (
                        <Badge
                          variant='outline'
                          className='text-green-600 border-green-600'
                        >
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant='outline' className='text-gray-500'>
                          Tắt
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive hover:bg-destructive/10'
                      onClick={() => handleRemoveFromGroup(item.bannerId)}
                      disabled={removeFromGroupMutation.isPending || isMutating}
                    >
                      {removeFromGroupMutation.isPending ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info note */}
      <div className='flex items-start gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg'>
        <Info className='h-4 w-4 mt-0.5 shrink-0' />
        <p>
          Nhóm banner có thể chứa nhiều banner khác nhau. Việc xóa banner khỏi
          nhóm sẽ không xóa banner khỏi hệ thống.
        </p>
      </div>
    </div>
  );
}

// Helper function to get position label
function getPositionLabel(position: string | null | undefined): string {
  switch (position) {
    case 'MAIN_CAROUSEL':
      return 'Carousel chính';
    case 'SIDE_TOP':
      return 'Bên phải (trên)';
    case 'SIDE_BOTTOM':
      return 'Bên phải (dưới)';
    default:
      return position || 'Không xác định';
  }
}
