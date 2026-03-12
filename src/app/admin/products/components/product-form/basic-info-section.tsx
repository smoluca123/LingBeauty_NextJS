'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { IProductFormData } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { generateSku } from './product-form-helpers';

// ============ Types ============
interface BasicInfoSectionProps {
  formData: IProductFormData;
  onNameChange: (name: string) => void;
  onFieldChange: <K extends keyof IProductFormData>(field: K, value: IProductFormData[K]) => void;
}

// ============ Component ============
export function BasicInfoSection({ formData, onNameChange, onFieldChange }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-pink">Thông tin cơ bản</h3>

      {/* Tên sản phẩm */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Tên sản phẩm <span className="text-primary-pink">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nhập tên sản phẩm"
          className="focus:ring-primary-pink focus:border-primary-pink"
        />
      </div>

      {/* Slug & SKU */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => onFieldChange('slug', e.target.value)}
            placeholder="ten-san-pham"
            className="focus:ring-primary-pink focus:border-primary-pink"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <div className="flex gap-2">
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => onFieldChange('sku', e.target.value)}
              placeholder="Tự động tạo nếu để trống"
              className="focus:ring-primary-pink focus:border-primary-pink"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => onFieldChange('sku', generateSku(formData.name))}
              className="shrink-0 border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
            >
              Tạo SKU
            </Button>
          </div>
        </div>
      </div>

      {/* Mô tả ngắn */}
      <div className="space-y-2">
        <Label htmlFor="shortDesc">Mô tả ngắn</Label>
        <Textarea
          id="shortDesc"
          value={formData.shortDesc}
          onChange={(e) => onFieldChange('shortDesc', e.target.value)}
          placeholder="Mô tả ngắn về sản phẩm (hiển thị trên danh sách)"
          rows={2}
          className="focus:ring-primary-pink focus:border-primary-pink"
        />
      </div>

      {/* Mô tả chi tiết */}
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả chi tiết</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          placeholder="Mô tả chi tiết sản phẩm"
          rows={4}
          className="focus:ring-primary-pink focus:border-primary-pink"
        />
      </div>
    </div>
  );
}
