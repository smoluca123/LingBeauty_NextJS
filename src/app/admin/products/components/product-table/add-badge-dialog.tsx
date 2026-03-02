'use client';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useCreateBadge, useCreateMultipleBadges } from '../../hooks';

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

const badgeItemSchema = z.object({
  name: z.string().min(1, 'Tên nhãn không được để trống'),
  type: z.enum(['NEW', 'SALE', 'BEST_SELLER', 'FREESHIPPING']),
  variant: z.enum(['PRIMARY', 'INFO', 'NEUTRAL']),
  sortOrder: z.number().int().min(0),
  isActive: z.boolean(),
});

const addBadgeSchema = z.object({
  badges: z.array(badgeItemSchema).min(1, 'Cần ít nhất 1 nhãn'),
});

type AddBadgeFormValues = z.infer<typeof addBadgeSchema>;

// ─── Default Badge ────────────────────────────────────────────────────────────

const DEFAULT_BADGE: AddBadgeFormValues['badges'][number] = {
  name: '',
  type: 'NEW',
  variant: 'INFO',
  sortOrder: 0,
  isActive: true,
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddBadgeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddBadgeDialog({
  open,
  onOpenChange,
  productId,
}: AddBadgeDialogProps) {
  const createBadgeMutation = useCreateBadge(productId);
  const createMultipleBadgesMutation = useCreateMultipleBadges(productId);

  const form = useForm<AddBadgeFormValues>({
    resolver: zodResolver(addBadgeSchema),
    defaultValues: {
      badges: [{ ...DEFAULT_BADGE }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'badges',
  });

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({ badges: [{ ...DEFAULT_BADGE }] });
    }
    onOpenChange(isOpen);
  };

  const onSubmit = (values: AddBadgeFormValues) => {
    if (values.badges.length === 1) {
      // Single badge → use single create API
      createBadgeMutation.mutate(values.badges[0], {
        onSuccess: () => {
          toast.success('Thêm nhãn thành công!');
          handleClose(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Không thể thêm nhãn.',
          );
        },
      });
    } else {
      // Multiple badges → use bulk create API
      createMultipleBadgesMutation.mutate(
        { badges: values.badges },
        {
          onSuccess: () => {
            toast.success(`Thêm ${values.badges.length} nhãn thành công!`);
            handleClose(false);
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : 'Không thể thêm nhãn.',
            );
          },
        },
      );
    }
  };

  const isPending =
    createBadgeMutation.isPending || createMultipleBadgesMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Thêm nhãn sản phẩm</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Thêm một hoặc nhiều nhãn cho sản phẩm
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-3">
                  {index > 0 && <Separator />}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Nhãn #{index + 1}
                    </span>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  {/* Name */}
                  <FormField
                    control={form.control}
                    name={`badges.${index}.name`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Tên nhãn</FormLabel>
                        <FormControl>
                          <Input placeholder="VD: New Arrival" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Type & Variant */}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`badges.${index}.type`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Loại nhãn</FormLabel>
                          <Select
                            onValueChange={f.onChange}
                            value={f.value}
                          >
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
                      name={`badges.${index}.variant`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Kiểu hiển thị</FormLabel>
                          <Select
                            onValueChange={f.onChange}
                            value={f.value}
                          >
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
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`badges.${index}.sortOrder`}
                      render={({ field: f }) => (
                        <FormItem>
                          <FormLabel>Thứ tự</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...f} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`badges.${index}.isActive`}
                      render={({ field: f }) => (
                        <FormItem className="flex flex-col justify-end">
                          <FormLabel>Kích hoạt</FormLabel>
                          <div className="flex items-center gap-2 h-9">
                            <FormControl>
                              <Switch
                                checked={f.value}
                                onCheckedChange={f.onChange}
                              />
                            </FormControl>
                            <span className="text-sm text-muted-foreground">
                              {f.value ? 'Đang bật' : 'Đã tắt'}
                            </span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <div className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => append({ ...DEFAULT_BADGE })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm nhãn khác
              </Button>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary-pink"
                disabled={isPending}
              >
                {isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {fields.length > 1
                  ? `Thêm ${fields.length} nhãn`
                  : 'Thêm nhãn'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
