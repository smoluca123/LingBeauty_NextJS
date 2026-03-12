'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  ICreateProductVariantPayload,
  VariantDisplayType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';

// ============ Types ============
interface VariantSectionProps {
  variants: ICreateProductVariantPayload[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: <K extends keyof ICreateProductVariantPayload>(
    index: number,
    field: K,
    value: ICreateProductVariantPayload[K],
  ) => void;
}

// ============ Component ============
export function VariantSection({ variants, onAdd, onRemove, onUpdate }: VariantSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary-pink">
          Biến thể sản phẩm
          {variants.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({variants.length} biến thể)
            </span>
          )}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="border-primary-pink/30 text-primary-pink hover:bg-primary-pink/10"
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm biến thể
        </Button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          Chưa có biến thể. Bấm &quot;Thêm biến thể&quot; để tạo.
        </p>
      )}

      {variants.map((variant, index) => (
        <div
          key={index}
          className="rounded-lg border border-primary-pink/20 bg-primary-pink/5 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-pink">
              Biến thể #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tên biến thể */}
            <div className="space-y-1.5">
              <Label className="text-xs">
                Tên <span className="text-primary-pink">*</span>
              </Label>
              <Input
                value={variant.name}
                onChange={(e) => onUpdate(index, 'name', e.target.value)}
                placeholder="VD: Đỏ - Size M"
                className="h-9 text-sm focus:ring-primary-pink focus:border-primary-pink"
              />
            </div>

            {/* SKU */}
            <div className="space-y-1.5">
              <Label className="text-xs">SKU</Label>
              <Input
                value={variant.sku}
                onChange={(e) => onUpdate(index, 'sku', e.target.value)}
                placeholder="Tự động tạo nếu trống"
                className="h-9 text-sm focus:ring-primary-pink focus:border-primary-pink"
              />
            </div>

            {/* Màu sắc — dùng ColorPicker component */}
            <div className="space-y-1.5">
              <Label className="text-xs">Màu sắc</Label>
              <ColorPicker
                value={variant.color || ''}
                onChange={(hex) => onUpdate(index, 'color', hex)}
                placeholder="Chọn màu..."
                allowClear
              />
            </div>

            {/* Kích cỡ */}
            <div className="space-y-1.5">
              <Label className="text-xs">Kích cỡ</Label>
              <Input
                value={variant.size || ''}
                onChange={(e) => onUpdate(index, 'size', e.target.value)}
                placeholder="VD: M, L, XL"
                className="h-9 text-sm focus:ring-primary-pink focus:border-primary-pink"
              />
            </div>

            {/* Loại (type — text tự do) */}
            <div className="space-y-1.5">
              <Label className="text-xs">Loại</Label>
              <Input
                value={variant.type || ''}
                onChange={(e) => onUpdate(index, 'type', e.target.value)}
                placeholder="VD: Standard, Premium"
                className="h-9 text-sm focus:ring-primary-pink focus:border-primary-pink"
              />
            </div>

            {/* Display Type */}
            <div className="space-y-1.5">
              <Label className="text-xs">Hiển thị dạng</Label>
              <Select
                value={variant.displayType ?? 'COLOR'}
                onValueChange={(val) =>
                  onUpdate(index, 'displayType', val as VariantDisplayType)
                }
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COLOR">COLOR — màu sắc</SelectItem>
                  <SelectItem value="IMAGE">IMAGE — hình ảnh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Giá — optional */}
            <div className="space-y-1.5">
              <Label className="text-xs">
                Giá{' '}
                <span className="text-muted-foreground font-normal">(tuỳ chọn)</span>
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  value={variant.price ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdate(
                      index,
                      'price',
                      val === '' ? undefined : parseInt(val) || 0,
                    );
                  }}
                  placeholder="Dùng giá sản phẩm"
                  className="h-9 text-sm pr-8 focus:ring-primary-pink focus:border-primary-pink"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  ₫
                </span>
              </div>
            </div>

            {/* Số lượng */}
            <div className="space-y-1.5">
              <Label className="text-xs">Số lượng</Label>
              <Input
                type="number"
                min="0"
                value={variant.quantity ?? ''}
                onChange={(e) =>
                  onUpdate(index, 'quantity', parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="h-9 text-sm focus:ring-primary-pink focus:border-primary-pink"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
