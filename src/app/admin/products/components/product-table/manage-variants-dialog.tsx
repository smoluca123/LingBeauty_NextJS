'use client';

import { useState } from 'react';
import { Pencil, Trash2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces';
import { useProductVariants, useDeleteVariant } from '../../hooks';
import { formatPrice } from './helpers';
import { EditVariantDialog } from './edit-variant-dialog';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ManageVariantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IAdminProductDataType | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ManageVariantsDialog({
  open,
  onOpenChange,
  product,
}: ManageVariantsDialogProps) {
  const productId = product?.id ?? '';

  const { data, isLoading } = useProductVariants(open ? productId : undefined);
  const variants = (data?.data ?? []) as IProductVariantDataType[];

  const deleteVariantMutation = useDeleteVariant(productId);

  const [editTarget, setEditTarget] = useState<IProductVariantDataType | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (variant: IProductVariantDataType) => {
    setEditTarget(variant);
    setEditOpen(true);
  };

  const handleDelete = (variant: IProductVariantDataType) => {
    setDeletingId(variant.id);
    deleteVariantMutation.mutate(variant.id, {
      onSuccess: () => {
        toast.success(`Đã xóa biến thể "${variant.name}"!`);
        setDeletingId(null);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Không thể xóa biến thể.');
        setDeletingId(null);
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Quản lý biến thể — {product?.name}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {variants.length} biến thể
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : variants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <p className="font-medium">Chưa có biến thể nào</p>
                <p className="text-sm mt-1">Sử dụng &ldquo;Thêm biến thể&rdquo; để tạo mới.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên biến thể</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-center">Màu / Size / Loại</TableHead>
                    <TableHead className="text-center">Giá</TableHead>
                    <TableHead className="text-center">Tồn kho</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => {
                    const qty = variant.inventory?.quantity ?? 0;
                    const threshold = variant.inventory?.lowStockThreshold ?? 0;
                    const isOutOfStock = qty === 0;
                    const isLowStock = !isOutOfStock && qty <= threshold;

                    return (
                      <TableRow key={variant.id}>
                        <TableCell className="font-medium">{variant.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                            {variant.sku}
                          </code>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {variant.color && (
                              <Badge variant="outline" className="text-xs">{variant.color}</Badge>
                            )}
                            {variant.size && (
                              <Badge variant="outline" className="text-xs">{variant.size}</Badge>
                            )}
                            {variant.type && (
                              <Badge variant="outline" className="text-xs">{variant.type}</Badge>
                            )}
                            {!variant.color && !variant.size && !variant.type && (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {variant.price ? formatPrice(variant.price) : '—'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={isOutOfStock ? 'text-destructive' : isLowStock ? 'text-orange-500' : ''}>
                            {qty}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {isOutOfStock ? (
                            <div className="flex items-center justify-center gap-1 text-destructive text-xs">
                              <XCircle className="h-3.5 w-3.5" />
                              Hết hàng
                            </div>
                          ) : isLowStock ? (
                            <div className="flex items-center justify-center gap-1 text-orange-500 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Sắp hết
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1 text-green-600 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Còn hàng
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(variant)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(variant)}
                              disabled={deletingId === variant.id}
                            >
                              {deletingId === variant.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested edit dialog */}
      <EditVariantDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        productId={productId}
        variant={editTarget}
      />
    </>
  );
}
