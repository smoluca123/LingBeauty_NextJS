'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import {
  productVariantSchema,
  ProductVariantFormValues,
  productVariantDefaultValues,
} from '@/lib/zod-schemas/product-variant.schema';
import { useUpdateVariant } from '../../hooks';

// ─── Props ────────────────────────────────────────────────────────────────────

interface EditVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  variant: IProductVariantDataType | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditVariantDialog({
  open,
  onOpenChange,
  productId,
  variant,
}: EditVariantDialogProps) {
  const updateVariantMutation = useUpdateVariant(productId);
  const isPending = updateVariantMutation.isPending;

  const form = useForm<ProductVariantFormValues>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: productVariantDefaultValues,
  });

  // Populate form when variant changes
  useEffect(() => {
    if (variant) {
      form.reset({
        name: variant.name ?? '',
        sku: variant.sku ?? '',
        color: variant.color ?? '',
        size: variant.size ?? '',
        type: variant.type ?? '',
        price: variant.price ? Number(variant.price) : undefined,
        quantity: variant.inventory?.quantity ?? 0,
        lowStockThreshold: variant.inventory?.lowStockThreshold ?? 10,
        sortOrder: variant.sortOrder ?? 0,
      });
    }
  }, [variant, form]);

  const handleSubmit = form.handleSubmit((values) => {
    if (!variant) return;
    updateVariantMutation.mutate(
      {
        variantId: variant.id,
        data: {
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
      },
      {
        onSuccess: () => {
          toast.success(`Đã cập nhật biến thể "${values.name}"!`);
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Không thể cập nhật biến thể.',
          );
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa biến thể</DialogTitle>
          <p className="text-sm text-muted-foreground">SKU: {variant?.sku}</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col gap-4">
            <Tabs defaultValue="info" className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="pricing">Giá</TabsTrigger>
                <TabsTrigger value="inventory">Kho</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto mt-4">
                {/* Info Tab */}
                <TabsContent value="info" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên biến thể *</FormLabel>
                        <FormControl><Input placeholder="VD: Đỏ - Size M" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl><Input placeholder="VD: SKU-001-RED" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Màu sắc</FormLabel>
                          <FormControl><Input placeholder="Đỏ" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kích thước</FormLabel>
                          <FormControl><Input placeholder="M" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại</FormLabel>
                          <FormControl><Input placeholder="Standard" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thứ tự hiển thị</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="mt-0 space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá bán (₫)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            step={1000}
                            placeholder="0"
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Inventory Tab */}
                <TabsContent value="inventory" className="mt-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lượng tồn kho</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngưỡng cảnh báo</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="border-t pt-4 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy
              </Button>
              <Button type="submit" variant="primary-pink" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
