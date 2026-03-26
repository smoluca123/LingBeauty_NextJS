'use client';

import { useState } from 'react';
import { Plus, Sliders } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { useProductVariantsQuery } from '@/hooks/querys/admin-product.query';
import {
  useAddProductVariantMutation,
  useUpdateProductVariantMutation,
  useDeleteProductVariantMutation,
} from '@/hooks/mutations/admin-product.mutation';
import { VariantImagesDialog } from '@/app/admin/products/components/variant-images-dialog';
import { VariantRow } from './variant-row';
import { AddVariantRow } from './add-variant-row';
import type { ProductVariantsDialogProps } from './types';

import type {
  IAdminProductVariant,
  ICreateProductVariantPayload,
  IUpdateProductVariantPayload,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ ProductVariantsDialog ============

export function ProductVariantsDialog({
  productId,
  productName,
  open,
  onOpenChange,
}: ProductVariantsDialogProps) {
  const [imageVariant, setImageVariant] = useState<IAdminProductVariant | null>(
    null,
  );
  const [isAdding, setIsAdding] = useState(false);

  const { data: variantsData, isLoading } = useProductVariantsQuery(
    open ? productId : null,
  );
  const addMutation = useAddProductVariantMutation(productId);
  const updateMutation = useUpdateProductVariantMutation(productId);
  const deleteMutation = useDeleteProductVariantMutation(productId);

  const variants = variantsData?.data ?? [];

  const handleSaveUpdate = (
    variantId: string,
    data: IUpdateProductVariantPayload,
  ) => {
    updateMutation.mutate({ variantId, data });
  };

  const handleAdd = (data: ICreateProductVariantPayload) => {
    addMutation.mutate(data, { onSuccess: () => setIsAdding(false) });
  };

  const handleDelete = (variantId: string) => {
    deleteMutation.mutate(variantId);
  };

  const anyPending =
    addMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] flex flex-col overflow-hidden w-[90vw] max-w-5xl">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Chỉnh sửa biến thể</DialogTitle>
              <DialogDescription>{productName}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* ── Summary ── */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {variants.length} biến thể
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
              onClick={() => setIsAdding(true)}
              disabled={isAdding || anyPending}
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm biến thể
            </Button>
          </div>

          {/* ── Table ── */}
          <div className="rounded-lg border overflow-x-auto">
            <Table className="min-w-max text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-32.5">Tên</TableHead>
                  <TableHead className="min-w-25">SKU</TableHead>
                  <TableHead className="min-w-35">Màu</TableHead>
                  <TableHead className="min-w-17.5">Size</TableHead>
                  <TableHead className="min-w-20">Loại</TableHead>
                  <TableHead className="min-w-27.5">Display Type</TableHead>
                  <TableHead className="min-w-27.5">Giá</TableHead>
                  <TableHead className="text-center min-w-20">
                    Số lượng
                  </TableHead>
                  <TableHead className="text-center min-w-25">
                    Ngưỡng hết
                  </TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(10)].map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : variants.length === 0 && !isAdding ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      Chưa có biến thể nào. Bấm &quot;Thêm biến thể&quot; để
                      tạo.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {variants.map((variant) => (
                      <VariantRow
                        key={variant.id}
                        variant={variant}
                        isUpdating={
                          updateMutation.isPending &&
                          updateMutation.variables?.variantId === variant.id
                        }
                        isDeleting={
                          deleteMutation.isPending &&
                          deleteMutation.variables === variant.id
                        }
                        onSave={handleSaveUpdate}
                        onDelete={handleDelete}
                        onManageImages={setImageVariant}
                      />
                    ))}
                    {isAdding && (
                      <AddVariantRow
                        isSaving={addMutation.isPending}
                        onSave={handleAdd}
                        onCancel={() => setIsAdding(false)}
                      />
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-primary-pink/20">
          <Button
            variant="primary-pink"
            onClick={() => onOpenChange(false)}
            disabled={anyPending}
          >
            Hoàn thành
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Variant Images Dialog */}
      {imageVariant && (
        <VariantImagesDialog
          productId={productId}
          variantId={imageVariant.id}
          variantName={imageVariant.name}
          open={!!imageVariant}
          onOpenChange={(isOpen: boolean) => {
            if (!isOpen) setImageVariant(null);
          }}
        />
      )}
    </Dialog>
  );
}
