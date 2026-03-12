'use client';

import { useState } from 'react';
import { Pencil, Trash2, Loader2, Check, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '@/components/ui/color-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import type {
  IAdminProductVariant,
  IUpdateProductVariantPayload,
  VariantDisplayType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { type EditState, toEditState } from './types';
import { ColorSwatch } from './color-swatch';

// ============ VariantRow ============

export interface VariantRowProps {
  variant: IAdminProductVariant;
  isUpdating: boolean;
  isDeleting: boolean;
  onSave: (variantId: string, data: IUpdateProductVariantPayload) => void;
  onDelete: (variantId: string) => void;
  onManageImages: (variant: IAdminProductVariant) => void;
}

export function VariantRow({
  variant,
  isUpdating,
  isDeleting,
  onSave,
  onDelete,
  onManageImages,
}: VariantRowProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditState>(toEditState(variant));
  const isLoading = isUpdating || isDeleting;

  const handleEdit = () => {
    setForm(toEditState(variant));
    setEditing(true);
  };

  const handleSave = () => {
    onSave(variant.id, {
      sku: form.sku || undefined,
      name: form.name || undefined,
      color: form.color || undefined,
      size: form.size || undefined,
      type: form.type || undefined,
      displayType: form.displayType,
      // price optional — chỉ gửi khi có giá trị
      price: form.price !== '' ? Number(form.price) : undefined,
      quantity: form.quantity !== '' ? Number(form.quantity) : undefined,
      lowStockThreshold:
        form.lowStockThreshold !== '' ? Number(form.lowStockThreshold) : undefined,
    });
    setEditing(false);
  };

  const field = (key: keyof EditState, placeholder?: string) => (
    <Input
      value={form[key]}
      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
      className="h-7 text-xs px-2 min-w-0"
      placeholder={placeholder}
      disabled={isLoading}
    />
  );

  return (
    <TableRow>
      {/* Tên */}
      <TableCell className="text-xs">
        {editing ? field('name') : <span className="font-medium">{variant.name}</span>}
      </TableCell>

      {/* SKU */}
      <TableCell className="text-xs">
        {editing ? field('sku') : (
          <code className="bg-muted px-1 py-0.5 rounded text-xs">{variant.sku}</code>
        )}
      </TableCell>

      {/* Màu — ColorPicker khi edit, ColorSwatch khi xem */}
      <TableCell className="text-xs min-w-[140px]">
        {editing ? (
          <ColorPicker
            value={form.color}
            onChange={(hex) => setForm((prev) => ({ ...prev, color: hex }))}
            placeholder="Chọn màu"
            allowClear
            className="h-7 text-xs"
          />
        ) : (
          <ColorSwatch color={variant.color} />
        )}
      </TableCell>

      {/* Size */}
      <TableCell className="text-xs">
        {editing ? field('size', 'VD: M') : (variant.size ?? '—')}
      </TableCell>

      {/* Loại (text tự do) */}
      <TableCell className="text-xs">
        {editing ? field('type', 'Loại') : (variant.type ?? '—')}
      </TableCell>

      {/* Display Type — enum SELECT */}
      <TableCell className="text-xs min-w-[110px]">
        {editing ? (
          <Select
            value={form.displayType}
            onValueChange={(val) =>
              setForm((prev) => ({ ...prev, displayType: val as VariantDisplayType }))
            }
            disabled={isLoading}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COLOR">COLOR</SelectItem>
              <SelectItem value="IMAGE">IMAGE</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span
            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${
              variant.displayType === 'COLOR'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-violet-100 text-violet-700'
            }`}
          >
            {variant.displayType}
          </span>
        )}
      </TableCell>

      {/* Giá — optional */}
      <TableCell className="text-xs">
        {editing ? (
          <div className="relative">
            {field('price', 'Tùy chọn')}
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
              ₫
            </span>
          </div>
        ) : (
          variant.price
            ? `${Number(variant.price).toLocaleString('vi-VN')}₫`
            : <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Số lượng */}
      <TableCell className="text-xs text-center">
        {editing ? field('quantity') : (variant.inventory?.quantity ?? 0)}
      </TableCell>

      {/* Ngưỡng */}
      <TableCell className="text-xs text-center">
        {editing ? field('lowStockThreshold') : (variant.inventory?.lowStockThreshold ?? 10)}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={handleSave}
                disabled={isLoading}
                title="Lưu"
              >
                {isUpdating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:bg-muted"
                onClick={() => setEditing(false)}
                disabled={isLoading}
                title="Hủy"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                onClick={() => onManageImages(variant)}
                disabled={isLoading}
                title="Quản lý ảnh"
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-primary-pink hover:bg-primary-pink/10"
                onClick={handleEdit}
                disabled={isLoading}
                title="Sửa"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(variant.id)}
                disabled={isLoading}
                title="Xóa"
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
