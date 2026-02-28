'use client';

import { useState } from 'react';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ICreateProductPayload } from '@/lib/apis/client/actions/admin-product.actions';
import { useCreateProduct, useBrands } from '../../hooks';
import { useAdminCategories } from '../../../categories/hooks';
import { ProductFormState, DEFAULT_PRODUCT_FORM } from './product-form.types';
import { flattenCategories, generateSku } from './helpers';
import {
  BasicInfoSection,
  PricingSection,
  DisplaySettingsSection,
} from './product-form-sections';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const [form, setForm] = useState<ProductFormState>(DEFAULT_PRODUCT_FORM);

  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useBrands();
  const createProductMutation = useCreateProduct();

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

  const handleClose = () => {
    setForm(DEFAULT_PRODUCT_FORM);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    const parsedPrice = parseFloat(form.basePrice);
    if (!parsedPrice || parsedPrice <= 0) {
      toast.error('Giá bán phải lớn hơn 0');
      return;
    }

    const payload: ICreateProductPayload = {
      name: form.name.trim(),
      sku: form.sku.trim() || generateSku(form.name),
      shortDesc: form.shortDesc.trim() || undefined,
      description: form.description.trim() || undefined,
      basePrice: parsedPrice,
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      categoryIds: form.categoryIds,
      brandId: form.brandId || undefined,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
    };

    createProductMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(`Đã thêm sản phẩm "${payload.name}" thành công!`);
        handleClose();
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Không thể thêm sản phẩm. Vui lòng thử lại.',
        );
      },
    });
  };

  const isSubmitDisabled =
    !form.name.trim() ||
    !form.basePrice ||
    parseFloat(form.basePrice) <= 0 ||
    form.categoryIds.length === 0 ||
    createProductMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>
                Điền thông tin để thêm sản phẩm vào hệ thống
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <BasicInfoSection
            form={form}
            set={set}
            idPrefix="ap"
            categoryOptions={flatCats}
            onCategoryToggle={toggleCategory}
            onCategoryRemove={removeCategory}
            brandOptions={brands}
            onBrandChange={(id) => set({ brandId: id })}
            showSkuGenerator
            onGenerateSku={() => set({ sku: generateSku(form.name || 'PRD') })}
          />

          <Separator />

          <PricingSection form={form} set={set} idPrefix="ap" />

          <Separator />

          <DisplaySettingsSection form={form} set={set} idPrefix="ap" />
        </div>

        <DialogFooter className="pt-4 border-t border-primary-pink/20">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createProductMutation.isPending}
            className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
          >
            Hủy
          </Button>
          <Button
            variant="primary-pink"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {createProductMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Package className="mr-2 h-4 w-4" />
            )}
            Thêm sản phẩm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
