'use client';

import { Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateProductMutation } from '@/hooks/querys/admin-product.query';
import { useAdminCategoriesQuery, useAdminBrandsQuery } from '@/hooks/querys/admin-category-brand.query';
import type { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { useEditProductForm } from './use-edit-product-form';
import {
  BasicInfoSection,
  CategoryBrandSection,
  PricingSection,
  VariantSection,
  OptionsSection,
} from '../product-form';

// ============ Types ============
interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IAdminProductDataType;
}

// ============ Component ============
export function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
  const {
    formData,
    updateField,
    handleNameChange,
    addVariant,
    removeVariant,
    updateVariant,
    buildUpdatePayload,
    isValid,
    hasChanges,
    resetForm,
  } = useEditProductForm(product);

  const updateMutation = useUpdateProductMutation();

  // Fetch real categories & brands (same pattern as add-product-dialog)
  const { data: catData } = useAdminCategoriesQuery();
  const { data: brandData } = useAdminBrandsQuery();
  const categories = catData?.data ?? [];
  const brands = brandData?.data?.items ?? [];

  const handleSubmit = () => {
    if (!isValid || !hasChanges) return;
    const payload = buildUpdatePayload();
    updateMutation.mutate(
      { productId: product.id, data: payload },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-7xl max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Chỉnh sửa sản phẩm</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin sản phẩm &ldquo;{product.name}&rdquo;
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <BasicInfoSection
            formData={formData}
            onNameChange={handleNameChange}
            onFieldChange={updateField}
          />

          <CategoryBrandSection
            formData={formData}
            categories={categories}
            brands={brands}
            onFieldChange={updateField}
          
          />

          <PricingSection
            formData={formData}
            onFieldChange={updateField}
          />

          <VariantSection
            variants={formData.variants}
            onAdd={addVariant}
            onRemove={removeVariant}
            onUpdate={updateVariant}
          />

          <OptionsSection
            formData={formData}
            onFieldChange={updateField}
          />
        </div>

        <DialogFooter className="pt-4 border-t border-primary-pink/20">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={updateMutation.isPending}
            className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
          >
            Hủy
          </Button>
          <Button
            variant="primary-pink"
            onClick={handleSubmit}
            disabled={!isValid || !hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="mr-2 h-4 w-4" />
            )}
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
