'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { IProductBadgeDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { useUpdateBadge } from '../../hooks';

// ─── Constants ────────────────────────────────────────────────────────────────

const BADGE_TYPES = [
  { value: 'NEW', label: 'Mới' },
  { value: 'SALE', label: 'Giảm giá' },
  { value: 'BEST_SELLER', label: 'Bán chạy' },
  { value: 'FREESHIPPING', label: 'Miễn phí vận chuyển' },
] as const;

const BADGE_VARIANTS = [
  { value: 'PRIMARY', label: 'Primary' },
  { value: 'INFO', label: 'Info' },
  { value: 'NEUTRAL', label: 'Neutral' },
] as const;

// ─── Schema ───────────────────────────────────────────────────────────────────

const editBadgeSchema = z.object({
  name: z.string().min(1, 'Tên nhãn không được để trống'),
  type: z.enum(['NEW', 'SALE', 'BEST_SELLER', 'FREESHIPPING']),
  variant: z.enum(['PRIMARY', 'INFO', 'NEUTRAL']),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

type EditBadgeFormValues = z.infer<typeof editBadgeSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  badge: IProductBadgeDataType | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditBadgeDialog({
  open,
  onOpenChange,
  productId,
  badge,
}: EditBadgeDialogProps) {
  const updateBadgeMutation = useUpdateBadge(productId);

  const form = useForm<EditBadgeFormValues>({
    resolver: zodResolver(editBadgeSchema),
    defaultValues: {
      name: badge?.name ?? '',
      type: badge?.type ?? 'NEW',
      variant: badge?.variant ?? 'INFO',
      sortOrder: badge?.sortOrder ?? 0,
      isActive: badge?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (badge && open) {
      form.reset({
        name: badge.name,
        type: badge.type,
        variant: badge.variant,
        sortOrder: badge.sortOrder,
        isActive: badge.isActive,
      });
    }
  }, [badge, open, form]);

  const onSubmit = (values: EditBadgeFormValues) => {
    if (!badge) return;

    updateBadgeMutation.mutate(
      { badgeId: badge.id, data: values },
      {
        onSuccess: () => {
          toast.success('Cập nhật nhãn thành công!');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Không thể cập nhật nhãn.',
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa nhãn</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhãn</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: New Arrival" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type & Variant */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại nhãn</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BADGE_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
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
                name="variant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kiểu hiển thị</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn kiểu" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BADGE_VARIANTS.map((v) => (
                          <SelectItem key={v.value} value={v.value}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sort Order & Active */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự sắp xếp</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel>Kích hoạt</FormLabel>
                    <div className="flex items-center gap-2 h-9">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="text-sm text-muted-foreground">
                        {field.value ? 'Đang bật' : 'Đã tắt'}
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary-pink"
                disabled={updateBadgeMutation.isPending}
              >
                {updateBadgeMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
