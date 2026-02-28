'use client';

import { useState } from 'react';
import { Pencil, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IAdminProductDataType,
  IAdminCategoryDataType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { IUpdateProductPayload } from '@/lib/apis/client/actions/admin-product.actions';
import { ProductFormState, DEFAULT_PRODUCT_FORM } from './product-form.types';
import { flattenCategories } from './helpers';
import {
  BasicInfoSection,
  PricingSection,
  DisplaySettingsSection,
} from './product-form-sections';
import { useBrands } from '../../hooks';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IAdminProductDataType | null;
  categories: IAdminCategoryDataType[];
  onSave: (id: string, data: IUpdateProductPayload) => void;
  isPending?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Lấy categoryIds từ product — ưu tiên productCategories (nested) từ API */
function getProductCategoryIds(product: IAdminProductDataType): string[] {
  // API trả về productCategories dạng [{category: {id, name, slug}}]
  if (product.productCategories && product.productCategories.length > 0) {
    return product.productCategories.map((pc) => pc.category.id);
  }
  // Fallback: nếu có categories flat
  if (product.categories && product.categories.length > 0) {
    return product.categories.map((c) => c.id);
  }
  return [];
}

function productToForm(product: IAdminProductDataType): ProductFormState {
  return {
    name: product.name,
    sku: product.sku,
    shortDesc: product.shortDesc ?? '',
    description: product.description ?? '',
    basePrice: product.basePrice,
    comparePrice: product.comparePrice ?? '',
    categoryIds: getProductCategoryIds(product),
    brandId: product.brand?.id ?? '',
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditProductDialog({
  open,
  onOpenChange,
  product,
  categories,
  onSave,
  isPending = false,
}: EditProductDialogProps) {
  const [form, setForm] = useState<ProductFormState>(
    product ? productToForm(product) : DEFAULT_PRODUCT_FORM,
  );

  const { data: brands = [] } = useBrands();

  const set = (updates: Partial<ProductFormState>) =>
    setForm((prev) => ({ ...prev, ...updates }));

  const flatCats = flattenCategories(categories);

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((c) => c !== id)
        : [...prev.categoryIds, id],
    }));
  };

  const removeCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.filter((c) => c !== id),
    }));
  };

  const handleSave = () => {
    if (!product) return;

    const payload: IUpdateProductPayload = {
      name: form.name.trim() || undefined,
      shortDesc: form.shortDesc.trim() || undefined,
      description: form.description.trim() || undefined,
      basePrice: form.basePrice ? parseFloat(form.basePrice) : undefined,
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      categoryIds: form.categoryIds.length > 0 ? form.categoryIds : undefined,
      brandId: form.brandId || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    onSave(product.id, payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Chỉnh sửa sản phẩm</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin cho sản phẩm &quot;{product?.name}&quot;
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <BasicInfoSection
            form={form}
            set={set}
            idPrefix="ep"
            categoryOptions={flatCats}
            onCategoryToggle={toggleCategory}
            onCategoryRemove={removeCategory}
            brandOptions={brands}
            onBrandChange={(id) => set({ brandId: id })}
            skuDisabled
          />

          <Separator />

          <PricingSection form={form} set={set} idPrefix="ep" />

          <Separator />

          <DisplaySettingsSection form={form} set={set} idPrefix="ep" />
        </div>

        <DialogFooter className="pt-4 border-t border-primary-pink/20">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
          >
            Hủy
          </Button>
          <Button
            variant="primary-pink"
            onClick={handleSave}
            disabled={isPending || !form.name.trim()}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
