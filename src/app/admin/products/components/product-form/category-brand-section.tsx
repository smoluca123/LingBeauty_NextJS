'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CategoryMultiSelect } from '@/app/admin/products/components/category-multi-select';
import type { IProductFormData } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import type { IBrandDataType } from '@/lib/types/interfaces/apis/header.interfaces';
import type { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-category.interfaces';

// ============ Types ============
interface CategoryBrandSectionProps {
  formData: IProductFormData;
  categories: IAdminCategoryDataType[];
  brands: IBrandDataType[];
  onFieldChange: <K extends keyof IProductFormData>(field: K, value: IProductFormData[K]) => void;
}

// ============ Component ============
export function CategoryBrandSection({
  formData,
  categories,
  brands,
  onFieldChange,
}: CategoryBrandSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-pink">Phân loại</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Danh mục (multi-select) */}
        <div className="space-y-2">
          <Label>
            Danh mục <span className="text-primary-pink">*</span>
          </Label>
          <CategoryMultiSelect
            categories={categories}
            value={formData.categoryIds}
            onValueChange={(ids) => onFieldChange('categoryIds', ids)}
            placeholder="Tìm kiếm danh mục..."
          />
        </div>

        {/* Thương hiệu */}
        <div className="space-y-2">
          <Label>Thương hiệu</Label>
          <Select
            value={formData.brandId}
            onValueChange={(value) => onFieldChange('brandId', value)}
          >
            <SelectTrigger className="w-full focus:ring-primary-pink focus:border-primary-pink">
              <SelectValue placeholder="Chọn thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
