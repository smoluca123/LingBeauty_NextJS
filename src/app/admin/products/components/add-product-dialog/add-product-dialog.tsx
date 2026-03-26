'use client';

import { Package, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateProductMutation } from '@/hooks/mutations/admin-product.mutation';
import { useAdminCategoriesQuery, useAdminBrandsQuery } from '@/hooks/querys/admin-category-brand.query';
import { useProductForm } from './use-product-form';
import {
  BasicInfoSection,
  CategoryBrandSection,
  PricingSection,
  VariantSection,
  OptionsSection,
} from '@/app/admin/products/components/product-form';

// ============ Types ============
interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============ Component ============
export function AddProductDialog({ open, onOpenChange }: AddProductDialogProps) {
  const {
    formData,
    updateField,
    handleNameChange,
    addVariant,
    removeVariant,
    updateVariant,
    buildPayload,
    isValid,
    resetForm,
  } = useProductForm();

  const createMutation = useCreateProductMutation();

  // Fetch real categories & brands
  const { data: catData } = useAdminCategoriesQuery();
  const { data: brandData } = useAdminBrandsQuery();

  // Chỉ lấy các category thực sự (type === 'CATEGORY'), loại bỏ "Thương hiệu" root
  const categories = (catData?.data ?? []).filter((cat) => cat.type !== 'BRAND');

  // Lấy brands từ 2 nguồn và merge:
  // 1. Từ Brand table (API admin/brands)
  const brandsFromAPI = brandData?.data?.items ?? [];

  // 2. Từ category tree: children của node type=BRAND
  //    (phòng khi brand chỉ được tạo trong Category tree mà chưa sync vào Brand table)
  const brandsFromCategoryTree: typeof brandsFromAPI = (catData?.data ?? [])
    .filter((cat) => cat.type === 'BRAND')
    .flatMap((brandRoot) =>
      (brandRoot.children ?? [])
        .filter((child) => child.type === 'BRAND')   // chỉ lấy brand-children
        .map((child) => ({
          id: (child as { brand?: { id?: string } }).brand?.id ?? child.id,
          name: (child as { brand?: { name?: string } }).brand?.name ?? child.name,
          slug: (child as { brand?: { slug?: string } }).brand?.slug ?? child.slug,
          description: (child as { brand?: { description?: string } }).brand?.description ?? '',
          isActive: child.isActive,
          logoMediaId: (child as { brand?: { logoMedia?: { id?: string } } }).brand?.logoMedia?.id ?? '',
          website: null as null,
          logoMedia: (child as { brand?: { logoMedia?: typeof brandsFromAPI[0]['logoMedia'] } }).brand?.logoMedia ?? null,
          createdAt: child.createdAt,
          updatedAt: child.updatedAt,
        }))
    );

  // Merge & dedupe theo name (case-insensitive): ưu tiên từ Brand table
  const brandNamesFromAPI = new Set(brandsFromAPI.map((b) => b.name.toLowerCase()));
  const extraBrands = brandsFromCategoryTree.filter(
    (b) => !brandNamesFromAPI.has(b.name.toLowerCase()),
  );
  const brands = [...brandsFromAPI, ...extraBrands];

  const handleSubmit = () => {
    if (!isValid) return;
    const payload = buildPayload();
    createMutation.mutate(payload, {
      onSuccess: () => {
        resetForm();
        onOpenChange(false);
      },
    });
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-7xl max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-primary-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-pink/10 text-primary-pink">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl">Thêm sản phẩm mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết để thêm sản phẩm vào hệ thống
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
            disabled={createMutation.isPending}
            className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
          >
            Hủy
          </Button>
          <Button
            variant="primary-pink"
            onClick={handleSubmit}
            disabled={!isValid || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Package className="mr-2 h-4 w-4" />
            )}
            {createMutation.isPending ? 'Đang tạo...' : 'Thêm sản phẩm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
