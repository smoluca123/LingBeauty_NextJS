'use client';

import { useCallback, useRef, useState } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/tiptap-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateBannerMutation,
  useCreateBannerWithUploadMutation,
} from '@/hooks/mutations/admin-banner.mutation';
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';
import {
  BANNER_TYPES,
  BANNER_POSITIONS,
  DEFAULT_GRADIENT,
} from '@/app/admin/banners/constants';

// ── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  groupId: z.string().min(1, 'Vui lòng chọn nhóm banner').optional(),
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

interface CreateBannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: IBannerGroupDataType[];
  defaultGroupId: string | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CreateBannerDialog({
  open,
  onOpenChange,
  groups,
  defaultGroupId,
}: CreateBannerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Thêm banner mới</DialogTitle>
          <DialogDescription>Tạo banner mới trong nhóm</DialogDescription>
        </DialogHeader>

        {open && (
          <CreateBannerForm
            groups={groups}
            defaultGroupId={defaultGroupId}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Form Component ─────────────────────────────────────────────────────────────

function CreateBannerForm({
  groups,
  defaultGroupId,
  onClose,
}: {
  groups: IBannerGroupDataType[];
  defaultGroupId: string | null;
  onClose: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const createMutation = useCreateBannerMutation();
  const createWithUploadMutation = useCreateBannerWithUploadMutation();
  const isPending =
    createMutation.isPending || createWithUploadMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupId: defaultGroupId || '',
      type: 'TEXT',
      position: 'MAIN_CAROUSEL',
      badge: '',
      title: '',
      description: '',
      highlight: '',
      ctaText: '',
      ctaLink: '',
      subLabel: '',
      gradientFrom: DEFAULT_GRADIENT.from,
      gradientTo: DEFAULT_GRADIENT.to,
      sortOrder: 0,
      isActive: true,
    },
  });

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

      await createWithUploadMutation.mutateAsync({
        formData,
        groupId: data.groupId,
      });
    } else {
      await createMutation.mutateAsync({ ...data, groupId: data.groupId });
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

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
        <div className='grid gap-4 py-4'>
          {/* Group Selection */}
          <FormField
            control={form.control}
            name='groupId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nhóm banner <span className='text-destructive'>*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Chọn nhóm banner' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  <TiptapEditor
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder='Mô tả chi tiết...'
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
                      <Input {...field} placeholder='#FF6B9D' />
                      <input
                        type='color'
                        value={field.value || '#FF6B9D'}
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
                      <Input {...field} placeholder='#FF8E53' />
                      <input
                        type='color'
                        value={field.value || '#FF8E53'}
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
                Chọn ảnh
              </Button>
              {selectedFile && (
                <span className='text-sm text-muted-foreground'>
                  {selectedFile.name}
                </span>
              )}
            </div>
            {previewUrl && (
              <div className='relative w-fit'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
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
                Đang tạo...
              </>
            ) : (
              'Tạo banner'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
