'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useUpdateBannerMutation,
  useUpdateBannerWithUploadMutation,
} from '@/hooks/mutations/admin-banner.mutation';
import type { IBannerDataType } from '@/lib/types/interfaces/apis/banner.interfaces';
import Image from 'next/image';

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
  sortOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// ── Types ──────────────────────────────────────────────────────────────────────

interface EditBannerInGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: IBannerDataType | null;
  groupId: string | undefined;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EditBannerInGroupDialog({
  open,
  onOpenChange,
  banner,
}: EditBannerInGroupDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updateMutation = useUpdateBannerMutation();
  const updateWithUploadMutation = useUpdateBannerWithUploadMutation();
  const isPending =
    updateMutation.isPending || updateWithUploadMutation.isPending;

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      type: 'TEXT',
      position: 'MAIN_CAROUSEL',
      badge: '',
      title: '',
      description: '',
      highlight: '',
      ctaText: '',
      ctaLink: '',
      subLabel: '',
      gradientFrom: '#FF6B9D',
      gradientTo: '#FF8E53',
      sortOrder: 0,
      isActive: true,
    },
  });

  // Reset form when banner changes
  useEffect(() => {
    if (banner) {
      form.reset({
        type: banner.type || 'TEXT',
        position: banner.position || 'MAIN_CAROUSEL',
        badge: banner.badge || '',
        title: banner.title || '',
        description: banner.description || '',
        highlight: banner.highlight || '',
        ctaText: banner.ctaText || '',
        ctaLink: banner.ctaLink || '',
        subLabel: banner.subLabel || '',
        gradientFrom: banner.gradientFrom || '#FF6B9D',
        gradientTo: banner.gradientTo || '#FF8E53',
        sortOrder: banner.sortOrder ?? 0,
        isActive: banner.isActive ?? true,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
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

  const handleClose = useCallback(() => {
    if (!isPending) {
      handleRemoveFile();
      onOpenChange(false);
    }
  }, [isPending, handleRemoveFile, onOpenChange]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      await form.handleSubmit(async (data: FormValues) => {
        if (!banner) return;

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
          await updateMutation.mutateAsync({
            bannerId: banner.id,
            data: {
              type: data.type,
              position: data.position,
              badge: data.badge,
              title: data.title,
              description: data.description,
              highlight: data.highlight,
              ctaText: data.ctaText,
              ctaLink: data.ctaLink,
              subLabel: data.subLabel,
              gradientFrom: data.gradientFrom,
              gradientTo: data.gradientTo,
              sortOrder: data.sortOrder,
              isActive: data.isActive,
            },
          });
        }

        handleClose();
      })(e);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      banner,
      selectedFile,
      updateMutation,
      updateWithUploadMutation,
      handleClose,
      form.handleSubmit,
    ],
  );

  const existingImageUrl = banner?.imageUrl || banner?.imageMedia?.url;
  const displayImageUrl = previewUrl || existingImageUrl;

  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-hidden p-0'>
        <DialogHeader className='px-6 pt-6 pb-2'>
          <DialogTitle>Chỉnh sửa banner</DialogTitle>
          <DialogDescription>Cập nhật thông tin banner</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className='flex flex-col'
          >
            <ScrollArea className='flex-1 px-6 py-4 max-h-[calc(90vh-140px)]'>
              <div className='space-y-4'>
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
                          value={field.value}
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
                          value={field.value}
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
                            <SelectItem value='SIDE_TOP'>
                              Bên phải trên
                            </SelectItem>
                            <SelectItem value='SIDE_BOTTOM'>
                              Bên phải dưới
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                        <Input placeholder='Nhập tiêu đề banner' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Badge */}
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
                          rows={2}
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
                          <Input
                            placeholder='/products/flash-sale'
                            {...field}
                          />
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
                          width={160}
                          height={96}
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
              </div>
            </ScrollArea>

            <DialogFooter className='px-6 py-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button variant='primary-pink' type='submit' disabled={isPending}>
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
      </DialogContent>
    </Dialog>
  );
}
