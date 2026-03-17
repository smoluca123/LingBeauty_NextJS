'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
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
import { useUpdateBannerGroupMutation } from '@/hooks/mutations/admin-banner.mutation';
import type { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';

// ── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên nhóm'),
  slug: z.string().min(1, 'Vui lòng nhập slug'),
  description: z.string().optional(),
  isActive: z.boolean(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// ── Types ──────────────────────────────────────────────────────────────────────

interface EditBannerGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: IBannerGroupDataType | null;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function EditBannerGroupDialog({
  open,
  onOpenChange,
  group,
}: EditBannerGroupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nhóm banner</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin nhóm banner &ldquo;{group?.name}&rdquo;
          </DialogDescription>
        </DialogHeader>

        {group && (
          <EditBannerGroupForm
            group={group}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Form Component ─────────────────────────────────────────────────────────────

function EditBannerGroupForm({
  group,
  onClose,
}: {
  group: IBannerGroupDataType;
  onClose: () => void;
}) {
  const updateMutation = useUpdateBannerGroupMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const handleClose = () => {
    if (!updateMutation.isPending) {
      onClose();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid gap-4 py-4'>
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
              <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-2'>
                <div className='space-y-0.5'>
                  <FormLabel>Kích hoạt</FormLabel>
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
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            variant='primary-pink'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
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
