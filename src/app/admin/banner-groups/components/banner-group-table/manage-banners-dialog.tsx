'use client';

import { useState, useRef, useCallback } from 'react';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  Upload,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminBannersQuery } from '@/hooks/querys/admin-banner.query';
import {
  useCreateBannerMutation,
  useCreateBannerWithUploadMutation,
  useUpdateBannerMutation,
  useUpdateBannerWithUploadMutation,
  useDeleteBannerMutation,
} from '@/hooks/mutations/admin-banner.mutation';
import type {
  IBannerGroupDataType,
  IBannerDataType,
} from '@/lib/types/interfaces/apis/banner.interfaces';
import type { IApiPaginationResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import Image from 'next/image';

// Form values type
interface FormValues {
  type: 'TEXT' | 'IMAGE';
  position: 'MAIN_CAROUSEL' | 'SIDE_TOP' | 'SIDE_BOTTOM';
  badge: string;
  title: string;
  description: string;
  highlight: string;
  ctaText: string;
  ctaLink: string;
  subLabel: string;
  gradientFrom: string;
  gradientTo: string;
  sortOrder: number;
  isActive: boolean;
}

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
  const [activeTab, setActiveTab] = useState('list');
  const [editingBanner, setEditingBanner] = useState<IBannerDataType | null>(
    null,
  );
  const [deleteBanner, setDeleteBanner] = useState<IBannerDataType | null>(
    null,
  );

  const handleClose = () => {
    setActiveTab('list');
    setEditingBanner(null);
    setDeleteBanner(null);
    onOpenChange(false);
  };

  const handleEdit = (banner: IBannerDataType) => {
    setEditingBanner(banner);
    setActiveTab('form');
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setActiveTab('form');
  };

  const handleBackToList = () => {
    setEditingBanner(null);
    setActiveTab('list');
  };

  const handleDelete = (banner: IBannerDataType) => {
    setDeleteBanner(banner);
  };

  const handleDeleteSuccess = () => {
    setDeleteBanner(null);
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[900px] max-h-[90vh] overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <DialogTitle>Quản lý banner - {group.name}</DialogTitle>
          <DialogDescription>
            Quản lý các banner thuộc nhóm &ldquo;{group.name}&rdquo;
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='flex-1 flex flex-col min-h-0'
        >
          <div className='px-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='list'>Danh sách banner</TabsTrigger>
              <TabsTrigger value='form'>
                {editingBanner ? 'Chỉnh sửa banner' : 'Thêm banner mới'}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className='flex-1 min-h-0 overflow-hidden'>
            <TabsContent value='list' className='mt-0 h-full'>
              <BannerListTab
                groupId={group.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddNew={handleAddNew}
              />
            </TabsContent>

            <TabsContent value='form' className='mt-0 h-full'>
              <BannerFormTab
                groupId={group.id}
                banner={editingBanner}
                onSuccess={handleBackToList}
                onCancel={handleBackToList}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <DeleteBannerAlertDialog
          open={!!deleteBanner}
          onOpenChange={(open) => !open && setDeleteBanner(null)}
          banner={deleteBanner}
          onSuccess={handleDeleteSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

// Banner List Tab Component
interface BannerListTabProps {
  groupId: string;
  onEdit: (banner: IBannerDataType) => void;
  onDelete: (banner: IBannerDataType) => void;
  onAddNew: () => void;
}

function BannerListTab({
  groupId,
  onEdit,
  onDelete,
  onAddNew,
}: BannerListTabProps) {
  const { data, isLoading, isError } = useAdminBannersQuery({
    groupId,
    limit: 100,
  });

  const result = data as
    | IApiPaginationResponseWrapperType<IBannerDataType>
    | undefined;
  const banners = result?.data?.items ?? [];

  const getPositionLabel = (position: string) => {
    switch (position) {
      case 'MAIN_CAROUSEL':
        return 'Carousel chính';
      case 'SIDE_TOP':
        return 'Bên phải trên';
      case 'SIDE_BOTTOM':
        return 'Bên phải dưới';
      default:
        return position;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'TEXT':
        return 'Văn bản';
      case 'IMAGE':
        return 'Hình ảnh';
      default:
        return type;
    }
  };

  return (
    <div className='flex flex-col h-full'>
      <div className='px-6 py-3 border-b flex items-center justify-between bg-muted/30'>
        <div className='text-sm text-muted-foreground'>
          {banners.length > 0
            ? `Tổng số: ${banners.length} banner`
            : 'Chưa có banner nào'}
        </div>
        <Button size='sm' onClick={onAddNew}>
          <Plus className='h-4 w-4 mr-1' />
          Thêm banner
        </Button>
      </div>

      <ScrollArea className='flex-1 px-6 py-2'>
        {isLoading && (
          <div className='flex items-center justify-center py-10'>
            <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
          </div>
        )}

        {isError && (
          <div className='text-center py-10 text-destructive'>
            Lỗi khi tải danh sách banner. Vui lòng thử lại.
          </div>
        )}

        {!isLoading && !isError && banners.length === 0 && (
          <div className='flex flex-col items-center justify-center py-10 text-muted-foreground gap-3'>
            <ImageIcon className='h-10 w-10' />
            <p>Chưa có banner nào trong nhóm này</p>
            <Button variant='outline' size='sm' onClick={onAddNew}>
              <Plus className='h-4 w-4 mr-1' />
              Thêm banner đầu tiên
            </Button>
          </div>
        )}

        {!isLoading && !isError && banners.length > 0 && (
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[50px]'>STT</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className='text-right'>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner, index) => (
                  <TableRow key={banner.id}>
                    <TableCell className='font-medium'>{index + 1}</TableCell>
                    <TableCell>
                      {banner.imageUrl || banner.imageMedia?.url ? (
                        <Image
                          width={100}
                          height={100}
                          src={banner.imageUrl || banner.imageMedia?.url || ''}
                          alt={banner.title || 'Banner'}
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
                        <span className='font-medium truncate max-w-[150px]'>
                          {banner.title || 'Không có tiêu đề'}
                        </span>
                        {banner.badge && (
                          <span className='text-xs text-muted-foreground'>
                            {banner.badge}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {getPositionLabel(banner.position)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          banner.type === 'IMAGE' ? 'default' : 'secondary'
                        }
                      >
                        {getTypeLabel(banner.type)}
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
                          title='Chỉnh sửa'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => onDelete(banner)}
                          title='Xóa'
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// Banner Form Tab Component
interface BannerFormTabProps {
  groupId: string;
  banner: IBannerDataType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function BannerFormTab({
  groupId,
  banner,
  onSuccess,
  onCancel,
}: BannerFormTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createMutation = useCreateBannerMutation();
  const createWithUploadMutation = useCreateBannerWithUploadMutation();
  const updateMutation = useUpdateBannerMutation();
  const updateWithUploadMutation = useUpdateBannerWithUploadMutation();

  const isPending =
    createMutation.isPending ||
    createWithUploadMutation.isPending ||
    updateMutation.isPending ||
    updateWithUploadMutation.isPending;

  const form = useForm<FormValues>({
    defaultValues: {
      type: banner?.type || 'TEXT',
      position: banner?.position || 'MAIN_CAROUSEL',
      badge: banner?.badge || '',
      title: banner?.title || '',
      description: banner?.description || '',
      highlight: banner?.highlight || '',
      ctaText: banner?.ctaText || '',
      ctaLink: banner?.ctaLink || '',
      subLabel: banner?.subLabel || '',
      gradientFrom: banner?.gradientFrom || '#FF6B9D',
      gradientTo: banner?.gradientTo || '#FF8E53',
      sortOrder: banner?.sortOrder ?? 0,
      isActive: banner?.isActive ?? true,
    },
  });

  // Set preview from existing banner image
  const existingImageUrl = banner?.imageUrl || banner?.imageMedia?.url;

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
    setPreviewUrl((prevPreviewUrl) => {
      if (prevPreviewUrl) {
        URL.revokeObjectURL(prevPreviewUrl);
      }
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (banner) {
        // Update existing banner
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
      } else {
        // Create new banner
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

          await createWithUploadMutation.mutateAsync({ groupId, formData });
        } else {
          await createMutation.mutateAsync({ groupId, data });
        }
      }

      handleRemoveFile();
      onSuccess();
    },
    [
      banner,
      groupId,
      selectedFile,
      createMutation,
      createWithUploadMutation,
      updateMutation,
      updateWithUploadMutation,
      handleRemoveFile,
      onSuccess,
    ],
  );

  const displayImageUrl = previewUrl || existingImageUrl;

  return (
    <ScrollArea className='h-[calc(90vh-180px)] px-6 py-4'>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className='space-y-4'
        >
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
                      <SelectItem value='TEXT'>Văn bản</SelectItem>
                      <SelectItem value='IMAGE'>Hình ảnh</SelectItem>
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
                      <SelectItem value='MAIN_CAROUSEL'>
                        Carousel chính
                      </SelectItem>
                      <SelectItem value='SIDE_TOP'>Bên phải trên</SelectItem>
                      <SelectItem value='SIDE_BOTTOM'>Bên phải dưới</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Title & Badge */}
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder='Nhập tiêu đề banner' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='badge'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Badge (tùy chọn)</FormLabel>
                <FormControl>
                  <Input
                    placeholder='VD: Beauty Box, Flash Sale...'
                    {...field}
                  />
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
                <FormLabel>Mô tả (tùy chọn)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Nhập mô tả ngắn...'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Highlight & SubLabel */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='highlight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlight (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder='VD: Mua 1 tặng 3' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='subLabel'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhãn phụ (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder='VD: Số lượng có hạn' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CTA */}
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='ctaText'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text nút CTA (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder='VD: Mua ngay' {...field} />
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
                  <FormLabel>Link CTA (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder='/products/flash-sale' {...field} />
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
                  <FormLabel>Màu gradient từ</FormLabel>
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input
                        type='color'
                        {...field}
                        className='w-12 h-10 p-1'
                      />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      className='flex-1'
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='gradientTo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu gradient đến</FormLabel>
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input
                        type='color'
                        {...field}
                        className='w-12 h-10 p-1'
                      />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      className='flex-1'
                    />
                  </div>
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
                <FormLabel>Thứ tự sắp xếp</FormLabel>
                <FormControl>
                  <Input type='number' min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className='space-y-2'>
            <Label>Hình ảnh (tùy chọn)</Label>
            <div className='flex items-center gap-4'>
              {displayImageUrl ? (
                <div className='relative'>
                  <Image
                    width={100}
                    height={100}
                    src={displayImageUrl}
                    alt='Preview'
                    className='h-24 w-40 object-cover rounded-md border'
                  />
                  <button
                    type='button'
                    onClick={handleRemoveFile}
                    className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </div>
              ) : (
                <div className='h-24 w-40 bg-muted rounded-md flex flex-col items-center justify-center gap-1 border border-dashed'>
                  <ImageIcon className='h-8 w-8 text-muted-foreground' />
                  <span className='text-xs text-muted-foreground'>
                    Chưa có ảnh
                  </span>
                </div>
              )}
              <div className='flex-1'>
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
                  className='w-full'
                >
                  <Upload className='h-4 w-4 mr-2' />
                  {displayImageUrl ? 'Đổi ảnh' : 'Tải ảnh lên'}
                </Button>
                <p className='text-xs text-muted-foreground mt-1'>
                  Hỗ trợ JPG, PNG, WebP. Tối đa 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Active Status */}
          <FormField
            control={form.control}
            name='isActive'
            render={({ field }) => (
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                <div className='space-y-0.5'>
                  <FormLabel>Hiển thị</FormLabel>
                  <div className='text-sm text-muted-foreground'>
                    Banner sẽ được hiển thị trên trang chủ
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

          {/* Actions */}
          <DialogFooter className='pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Đang lưu...
                </>
              ) : banner ? (
                'Cập nhật'
              ) : (
                'Tạo banner'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </ScrollArea>
  );
}

// Delete Banner Alert Dialog
interface DeleteBannerAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: IBannerDataType | null;
  onSuccess: () => void;
}

function DeleteBannerAlertDialog({
  open,
  onOpenChange,
  banner,
  onSuccess,
}: DeleteBannerAlertDialogProps) {
  const deleteMutation = useDeleteBannerMutation();

  const handleDelete = async () => {
    if (!banner) return;

    await deleteMutation.mutateAsync(banner.id);
    onSuccess();
    onOpenChange(false);
  };

  if (!banner) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa banner?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa banner &ldquo;
            {banner.title || banner.badge || 'Không có tiêu đề'}&rdquo;?
            <br />
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className='bg-destructive hover:bg-destructive/90'
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
