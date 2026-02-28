'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductFormState, CategoryOption, BrandOption } from './product-form.types';
import { CategoryMultiSelect } from './category-multi-select';

// ─── Shared Types ─────────────────────────────────────────────────────────────

interface FormSectionProps {
  form: ProductFormState;
  set: (updates: Partial<ProductFormState>) => void;
  idPrefix: string;
}

interface BasicInfoSectionProps extends FormSectionProps {
  categoryOptions: CategoryOption[];
  onCategoryToggle: (id: string) => void;
  onCategoryRemove: (id: string) => void;
  brandOptions: BrandOption[];
  onBrandChange: (id: string) => void;
  showSkuGenerator?: boolean;
  onGenerateSku?: () => void;
  skuDisabled?: boolean;
}

// ─── BasicInfoSection ─────────────────────────────────────────────────────────

export function BasicInfoSection({
  form,
  set,
  idPrefix,
  categoryOptions,
  onCategoryToggle,
  onCategoryRemove,
  brandOptions,
  onBrandChange,
  showSkuGenerator = false,
  onGenerateSku,
  skuDisabled = false,
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-pink text-sm uppercase tracking-wide">
        Thông tin cơ bản
      </h3>

      {/* Tên sản phẩm — full width */}
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-name`}>
          Tên sản phẩm <span className="text-destructive">*</span>
        </Label>
        <Input
          id={`${idPrefix}-name`}
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Nhập tên sản phẩm"
        />
      </div>

      {/* SKU + Thương hiệu — cùng 1 hàng, cân đối */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-sku`}>SKU</Label>
          <div className="flex gap-2">
            <Input
              id={`${idPrefix}-sku`}
              value={form.sku}
              onChange={(e) => set({ sku: e.target.value })}
              placeholder={showSkuGenerator ? 'Tự động tạo nếu để trống' : 'Mã SKU'}
              disabled={skuDisabled}
              className={skuDisabled ? 'opacity-60 cursor-not-allowed bg-muted' : ''}
            />
            {showSkuGenerator && onGenerateSku && (
              <Button
                type="button"
                variant="outline"
                className="shrink-0 border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
                onClick={onGenerateSku}
              >
                Tạo
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-brand`}>Thương hiệu</Label>
          <Select
            value={form.brandId || ''}
            onValueChange={(val) => onBrandChange(val === '__none__' ? '' : val)}
          >
            <SelectTrigger id={`${idPrefix}-brand`} className='w-full'>
              <SelectValue placeholder="Chọn thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Không chọn</SelectItem>
              {brandOptions.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Danh mục — full width để hiển thị badges thoải mái */}
      <CategoryMultiSelect
        options={categoryOptions}
        selectedIds={form.categoryIds}
        onToggle={onCategoryToggle}
        onRemove={onCategoryRemove}
        required
      />

      {/* Mô tả ngắn */}
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-shortdesc`}>Mô tả ngắn</Label>
        <Textarea
          id={`${idPrefix}-shortdesc`}
          value={form.shortDesc}
          onChange={(e) => set({ shortDesc: e.target.value })}
          placeholder="Mô tả ngắn hiển thị ở danh sách sản phẩm"
          rows={2}
        />
      </div>

      {/* Mô tả đầy đủ */}
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-description`}>Mô tả đầy đủ</Label>
        <Textarea
          id={`${idPrefix}-description`}
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="Mô tả chi tiết về sản phẩm"
          rows={4}
        />
      </div>
    </div>
  );
}

// ─── PricingSection ───────────────────────────────────────────────────────────

export function PricingSection({ form, set, idPrefix }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary-pink text-sm uppercase tracking-wide">
        Giá bán
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-base-price`}>
            Giá bán <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id={`${idPrefix}-base-price`}
              type="number"
              min={0}
              value={form.basePrice}
              onChange={(e) => set({ basePrice: e.target.value })}
              placeholder="0"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₫
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-compare-price`}>Giá gốc (so sánh)</Label>
          <div className="relative">
            <Input
              id={`${idPrefix}-compare-price`}
              type="number"
              min={0}
              value={form.comparePrice}
              onChange={(e) => set({ comparePrice: e.target.value })}
              placeholder="0"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DisplaySettingsSection ───────────────────────────────────────────────────

export function DisplaySettingsSection({ form, set, idPrefix }: FormSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-primary-pink text-sm uppercase tracking-wide">
        Cài đặt hiển thị
      </h3>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label htmlFor={`${idPrefix}-active`} className="font-medium">
            Đăng bán ngay
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sản phẩm sẽ hiển thị trên cửa hàng
          </p>
        </div>
        <Switch
          id={`${idPrefix}-active`}
          checked={form.isActive}
          onCheckedChange={(v) => set({ isActive: v })}
          className="data-[state=checked]:bg-primary-pink"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <Label htmlFor={`${idPrefix}-featured`} className="font-medium">
            Sản phẩm nổi bật
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ưu tiên hiển thị ở trang chủ
          </p>
        </div>
        <Switch
          id={`${idPrefix}-featured`}
          checked={form.isFeatured}
          onCheckedChange={(v) => set({ isFeatured: v })}
          className="data-[state=checked]:bg-primary-pink"
        />
      </div>
    </div>
  );
}
