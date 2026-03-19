'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Loader2,
  Upload,
  X,
  Plus,
  Trash2,
  Info,
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
import { Label } from '@/components/ui/label';
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
  useUpdateBannerMutation,
  useUpdateBannerWithUploadMutation,
  useAddBannerToGroupMutation,
  useRemoveBannerFromGroupMutation,
} from '@/hooks/mutations/admin-banner.mutation';
import { useBannerGroupsOfBannerQuery } from '@/hooks/querys/admin-banner.query';
import type {
  IBannerDataType,
  IBannerGroupDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';
import {
  BANNER_TYPES,
  BANNER_POSITIONS,
  DEFAULT_GRADIENT,
} from '@/app/admin/banners/constants';

// ── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  type: z.enum(['TEXT', 'IMAGE']),
  position: z.enum(['MAIN_CAROUSEL', 'SIDE_TOP', 'SIDE_BOTTOM']),
  badge: z.string().optional(),
  title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
  description: z.string().optional(),
  highlight: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  subLabel: z.string().optional(),
  gradientFrom: z.string().optional(),
  gradientTo: z.string().optional(),
  sortOrder: z.coerce.number<number>().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

// ── Types ──────────────────────────────────────────────────────────────────────

interface EditBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: (IBannerDataType & { groupId?: string }) | null;
  groups: IBannerGroupDataType[];
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EditBannerDialog({
  open,
  onOpenChange,
  banner,
  groups,
}: EditBannerDialogProps) {
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
          <DialogTitle className='text-xl'>Chỉnh sửa banner</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin banner &ldquo;
            {banner?.title || 'Không có tiêu đề'}&rdquo;
          </DialogDescription>
        </DialogHeader>

        {banner && (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <div className='px-6'>
              <TabsList className='grid w-full grid-cols-2 h-11'>
                <TabsTrigger value='info' className='gap-2 text-sm'>
                  <LayoutList className='h-4 w-4' />
                  Thông tin Banner
                </TabsTrigger>
                <TabsTrigger value='groups' className='gap-2 text-sm'>
                  <FolderTree className='h-4 w-4' />
                  Quản lý Nhóm
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='info' className='mt-0 m-0'>
              <ScrollArea className='h-[calc(90vh-180px)]'>
                <div className='px-6 pb-6 pt-4'>
                  <BannerInfoTab
                    key={banner.id}
                    banner={banner}
                    onClose={() => onOpenChange(false)}
                  />
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value='groups' className='mt-0 m-0'>
              <ScrollArea className='h-[calc(90vh-180px)]'>
                <div className='px-6 pb-6 pt-4'>
                  <GroupManagementTab banner={banner} allGroups={groups} />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==================== TAB 1: BANNER INFO ====================

function BannerInfoTab({
  banner,
  onClose,
}: {
  banner: IBannerDataType & { groupId?: string };
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updateMutation = useUpdateBannerMutation();
  const updateWithUploadMutation = useUpdateBannerWithUploadMutation();
  const isPending =
    updateMutation.isPending || updateWithUploadMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: (banner.type as 'TEXT' | 'IMAGE') ?? 'TEXT',
      position:
        (banner.position as 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM') ??
        'MAIN_CAROUSEL',
      badge: banner.badge ?? '',
      title: banner.title ?? '',
      description: banner.description ?? '',
      highlight: banner.highlight ?? '',
      ctaText: banner.ctaText ?? '',
      ctaLink: banner.ctaLink ?? '',
      subLabel: banner.subLabel ?? '',
      gradientFrom: banner.gradientFrom ?? DEFAULT_GRADIENT.from,
      gradientTo: banner.gradientTo ?? DEFAULT_GRADIENT.to,
      sortOrder: banner.sortOrder ?? 0,
      isActive: banner.isActive ?? true,
    },
  });

  // Reset form when banner changes
  useEffect(() => {
    form.reset({
      type: (banner.type as 'TEXT' | 'IMAGE') ?? 'TEXT',
      position:
        (banner.position as 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM') ??
        'MAIN_CAROUSEL',
      badge: banner.badge ?? '',
      title: banner.title ?? '',
      description: banner.description ?? '',
      highlight: banner.highlight ?? '',
      ctaText: banner.ctaText ?? '',
      ctaLink: banner.ctaLink ?? '',
      subLabel: banner.subLabel ?? '',
      gradientFrom: banner.gradientFrom ?? DEFAULT_GRADIENT.from,
      gradientTo: banner.gradientTo ?? DEFAULT_GRADIENT.to,
      sortOrder: banner.sortOrder ?? 0,
      isActive: banner.isActive ?? true,
    });
  }, [banner, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('type', data.type);
      formData.append('position', data.position);
      formData.append('badge', data.badge || '');
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('highlight', data.highlight || '');
      formData.append('ctaText', data.ctaText || '');
      formData.append('ctaLink', data.ctaLink || '');
      formData.append('subLabel', data.subLabel || '');
      formData.append('gradientFrom', data.gradientFrom || '');
      formData.append('gradientTo', data.gradientTo || '');
      formData.append('sortOrder', String(data.sortOrder));
      formData.append('isActive', String(data.isActive));
      formData.append('file', selectedFile);

      await updateWithUploadMutation.mutateAsync({
        bannerId: banner.id,
        formData,
      });
    } else {
      await updateMutation.mutateAsync({ bannerId: banner.id, data });
    }

    handleRemoveFile();
    onClose();
  };

  const handleClose = () => {
    if (!isPending) {
      handleRemoveFile();
      onClose();
    }
  };

  const displayImageUrl = previewUrl || banner.imageMedia?.url;

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <div className='grid gap-4 py-4'>
          {/* Type & Position */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại banner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn loại' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANNER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vị trí</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn vị trí' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BANNER_POSITIONS.map((pos) => (
                        <SelectItem key={pos.value} value={pos.value}>
                          {pos.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Badge */}
          <FormField
            control={form.control}
            name='badge'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='VD: Beauty Box' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tiêu đề <span className='text-destructive'>*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder='VD: FLASH SALE' />
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
                    placeholder='Mô tả chi tiết...'
                    rows={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Highlight */}
          <FormField
            control={form.control}
            name='highlight'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Điểm nhấn</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='VD: Mua 1 tặng 3' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CTA */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='ctaText'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nút CTA</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='VD: Mua ngay' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ctaLink'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link CTA</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='VD: /products/flash-sale' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Gradient Colors */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='gradientFrom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu gradient (từ)</FormLabel>
                  <FormControl>
                    <div className='flex gap-2'>
                      <Input {...field} placeholder={DEFAULT_GRADIENT.from} />
                      <input
                        type='color'
                        value={field.value || DEFAULT_GRADIENT.from}
                        onChange={(e) => field.onChange(e.target.value)}
                        className='w-10 h-10 rounded border cursor-pointer'
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='gradientTo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu gradient (đến)</FormLabel>
                  <FormControl>
                    <div className='flex gap-2'>
                      <Input {...field} placeholder={DEFAULT_GRADIENT.to} />
                      <input
                        type='color'
                        value={field.value || DEFAULT_GRADIENT.to}
                        onChange={(e) => field.onChange(e.target.value)}
                        className='w-10 h-10 rounded border cursor-pointer'
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sort Order */}
          <FormField
            control={form.control}
            name='sortOrder'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    min={0}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === '' ? 0 : Number(e.target.value),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className='grid gap-2'>
            <Label>Hình ảnh</Label>
            <div className='flex items-center gap-4'>
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
              />
              <Button
                type='button'
                variant='outline'
                onClick={() => fileInputRef.current?.click()}
                className='gap-2'
              >
                <Upload className='h-4 w-4' />
                {displayImageUrl ? 'Thay ảnh' : 'Chọn ảnh'}
              </Button>
              {selectedFile && (
                <span className='text-sm text-muted-foreground'>
                  {selectedFile.name}
                </span>
              )}
            </div>
            {displayImageUrl && (
              <div className='relative w-fit'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImageUrl}
                  alt='Preview'
                  className='h-32 w-auto rounded-lg border object-cover'
                />
                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  className='absolute -top-2 -right-2 h-6 w-6'
                  onClick={handleRemoveFile}
                >
                  <X className='h-3 w-3' />
                </Button>
              </div>
            )}
          </div>

          {/* Active Status */}
          <FormField
            control={form.control}
            name='isActive'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2'>
                <div className='space-y-0.5'>
                  <FormLabel>Đang hoạt động</FormLabel>
                  <FormMessage />
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
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button type='submit' variant='primary-pink' disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang cập nhật...
              </>
            ) : (
              'Cập nhật'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// ==================== TAB 2: GROUP MANAGEMENT ====================

function GroupManagementTab({
  banner,
  allGroups,
}: {
  banner: IBannerDataType & { groupId?: string };
  allGroups: IBannerGroupDataType[];
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  // Get all groups of this banner
  const { data: bannerGroupsData, isLoading: isLoadingGroups } =
    useBannerGroupsOfBannerQuery(banner.id);

  const addToGroupMutation = useAddBannerToGroupMutation();
  const removeFromGroupMutation = useRemoveBannerFromGroupMutation();

  // bannerGroupsData trả về dạng pagination với items
  const bannerGroups: IBannerGroupDataType[] = useMemo(
    () => bannerGroupsData?.data?.items ?? [],
    [bannerGroupsData?.data?.items],
  );

  const availableGroups = useMemo(() => {
    const currentGroupIds = new Set(bannerGroups.map((g) => g.id));
    return allGroups.filter(
      (g: IBannerGroupDataType) => !currentGroupIds.has(g.id),
    );
  }, [allGroups, bannerGroups]);

  const handleAddToGroup = useCallback(async () => {
    if (!selectedGroupId) return;
    await addToGroupMutation.mutateAsync({
      groupId: selectedGroupId,
      bannerId: banner.id,
    });
    setSelectedGroupId('');
  }, [selectedGroupId, banner.id, addToGroupMutation]);

  const handleRemoveFromGroup = useCallback(
    async (groupId: string) => {
      await removeFromGroupMutation.mutateAsync({
        groupId,
        bannerId: banner.id,
      });
    },
    [banner.id, removeFromGroupMutation],
  );

  const isLoading = isLoadingGroups;
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
            <CardDescription>Tổng nhóm</CardDescription>
            <CardTitle className='text-2xl'>{bannerGroups.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Nhóm khả dụng</CardDescription>
            <CardTitle className='text-2xl'>{availableGroups.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Trạng thái banner</CardDescription>
            <CardTitle className='text-lg'>
              {banner.isActive ? (
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
          Thêm vào nhóm
        </h4>
        <div className='flex gap-2'>
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger className='flex-1'>
              <SelectValue placeholder='Chọn nhóm để thêm...' />
            </SelectTrigger>
            <SelectContent>
              {availableGroups.length === 0 ? (
                <div className='p-2 text-sm text-muted-foreground text-center'>
                  Không có nhóm nào khả dụng
                </div>
              ) : (
                availableGroups.map((group: IBannerGroupDataType) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddToGroup}
            disabled={
              !selectedGroupId || addToGroupMutation.isPending || isMutating
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

      {/* Current groups list */}
      <div className='space-y-3'>
        <h4 className='text-sm font-medium flex items-center gap-2'>
          <FolderTree className='h-4 w-4' />
          Các nhóm hiện tại
        </h4>

        {bannerGroups.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-muted-foreground border rounded-lg'>
            <Inbox className='h-10 w-10 mb-2 opacity-50' />
            <p className='text-sm'>Banner chưa thuộc nhóm nào</p>
          </div>
        ) : (
          <div className='space-y-2'>
            {bannerGroups.map((item) => (
              <Card key={item.id} className='overflow-hidden'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-muted rounded-md flex items-center justify-center'>
                        <FolderTree className='h-5 w-5 text-muted-foreground' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='font-medium'>{item.name}</span>
                        <span className='text-xs text-muted-foreground'>
                          Slug: {item.slug}
                        </span>
                      </div>
                      {item.isActive ? (
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
                      onClick={() => handleRemoveFromGroup(item.id)}
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
          Một banner có thể thuộc về nhiều nhóm khác nhau. Việc xóa banner khỏi
          nhóm sẽ không xóa banner khỏi hệ thống.
        </p>
      </div>
    </div>
  );
}
