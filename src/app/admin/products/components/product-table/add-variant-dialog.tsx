'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layers, Palette, Tag, Package, DollarSign, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateVariant } from '../../hooks';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import {
  productVariantSchema,
  productVariantDefaultValues,
  type ProductVariantFormValues,
} from '@/lib/zod-schemas/product-variant.schema';
import type { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IAdminProductDataType | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddVariantDialog({
  open,
  onOpenChange,
  product,
}: AddVariantDialogProps) {
  const createVariantMutation = useCreateVariant(product?.id ?? '');
  const isPending = createVariantMutation.isPending;

  const form = useForm<ProductVariantFormValues>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: productVariantDefaultValues,
  });

  const handleSubmit = form.handleSubmit((values) => {
    createVariantMutation.mutate(
      {
        name: values.name,
        sku: values.sku || undefined,
        color: values.color || undefined,
        size: values.size || undefined,
        type: values.type || undefined,
        price: values.price,
        quantity: values.quantity,
        lowStockThreshold: values.lowStockThreshold,
        sortOrder: values.sortOrder,
      },
      {
        onSuccess: () => {
          toast.success(`Đã thêm biến thể "${values.name}" thành công!`);
          form.reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Không thể thêm biến thể. Vui lòng thử lại.',
          );
        },
      },
    );
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  // Has appearance fields filled? (for badge indicator on tab)
  const watchedColor = useWatch({ control: form.control, name: 'color' });
  const watchedSize  = useWatch({ control: form.control, name: 'size' });
  const watchedType  = useWatch({ control: form.control, name: 'type' });
  const hasAppearance = !!watchedColor || !!watchedSize || !!watchedType;

  const hasInfoError = !!form.formState.errors.name;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Thêm biến thể sản phẩm
          </DialogTitle>
          <DialogDescription>
            Biến thể cho sản phẩm&nbsp;
            <span className="font-medium text-foreground">{product?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-0">
            <Tabs defaultValue="info" className="w-full">

              {/* ── Tab bar ── */}
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="info" className="gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  Thông tin
                  {hasInfoError && (
                    <Badge
                      variant="destructive"
                      className="h-4 w-4 p-0 text-[9px] flex items-center justify-center rounded-full"
                    >
                      !
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="inventory" className="gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  Giá &amp; Kho
                </TabsTrigger>
              </TabsList>

              {/* ══════════════════════════════════════════════════════════
                  Tab 1 — Thông tin cơ bản
              ══════════════════════════════════════════════════════════ */}
              <TabsContent value="info" className="space-y-4 mt-0">

                {/* Tên biến thể */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên biến thể <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: Đỏ - Size M" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tên hiển thị của biến thể — nên đủ rõ để phân biệt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU biến thể</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ví dụ: SP001-RED-M (để trống để tự tạo)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* ── Thuộc tính hình thức ── */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5" />
                    Thuộc tính hình thức
                    {hasAppearance && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                        Đã điền
                      </Badge>
                    )}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Màu sắc */}
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Màu sắc</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: Đỏ, Xanh navy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Kích thước */}
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kích thước</FormLabel>
                          <FormControl>
                            <Input placeholder="Ví dụ: S, M, XL, 100ml" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Loại / Dung tích */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5" />
                          Loại / Dung tích
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ví dụ: Standard, Premium, 50ml, 100ml"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Dùng để phân biệt loại khác không phải màu hay kích thước
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* ══════════════════════════════════════════════════════════
                  Tab 2 — Giá & Tồn kho
              ══════════════════════════════════════════════════════════ */}
              <TabsContent value="inventory" className="space-y-4 mt-0">

                {/* ── Giá bán ── */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    Giá bán
                  </p>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá biến thể</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min={0}
                              placeholder="Để trống = dùng giá sản phẩm chính"
                              className="pr-6"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                              ₫
                            </span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Nếu để trống, giá sẽ kế thừa từ sản phẩm gốc
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* ── Tồn kho ── */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5" />
                    Tồn kho
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Số lượng ban đầu */}
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng ban đầu</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="0"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Ngưỡng cảnh báo */}
                    <FormField
                      control={form.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngưỡng cảnh báo thấp</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="10"
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) =>
                                field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormDescription>Cảnh báo khi dưới mức này</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* ── Footer ── */}
            <DialogFooter className="pt-4 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Huỷ
              </Button>
              <Button type="submit" variant="primary-pink" disabled={isPending}>
                {isPending ? 'Đang lưu...' : 'Thêm biến thể'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
