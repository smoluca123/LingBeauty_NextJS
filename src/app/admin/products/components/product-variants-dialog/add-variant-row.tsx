'use client';

import { useState } from 'react';
import { Loader2, Check, X } from 'lucide-react';
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
  ICreateProductVariantPayload,
  VariantDisplayType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { type EditState, EMPTY_ADD_STATE } from './types';

// ============ AddVariantRow ============

export interface AddVariantRowProps {
  isSaving: boolean;
  onSave: (data: ICreateProductVariantPayload) => void;
  onCancel: () => void;
}

export function AddVariantRow({ isSaving, onSave, onCancel }: AddVariantRowProps) {
  const [form, setForm] = useState<EditState>(EMPTY_ADD_STATE);

  const field = (key: keyof EditState, placeholder?: string) => (
    <Input
      value={form[key]}
      onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
      className="h-7 text-xs px-2 min-w-0"
      placeholder={placeholder}
      disabled={isSaving}
    />
  );

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      name: form.name,
      sku: form.sku || undefined,
      color: form.color || undefined,
      size: form.size || undefined,
      type: form.type || undefined,
      displayType: form.displayType,
      // Backend yêu cầu price >= 0 — fallback 0 khi bỏ trống
      price: form.price !== '' ? Number(form.price) : 0,
      quantity: form.quantity !== '' ? Number(form.quantity) : undefined,
      lowStockThreshold:
        form.lowStockThreshold !== '' ? Number(form.lowStockThreshold) : undefined,
    });
  };

  return (
    <TableRow className="bg-primary-pink/5">
      {/* Tên */}
      <TableCell>{field('name', 'Tên *')}</TableCell>

      {/* SKU */}
      <TableCell>{field('sku', 'SKU')}</TableCell>

      {/* Màu — ColorPicker */}
      <TableCell className="min-w-[140px]">
        <ColorPicker
          value={form.color}
          onChange={(hex) => setForm((prev) => ({ ...prev, color: hex }))}
          placeholder="Màu..."
          allowClear
          className="h-7 text-xs"
        />
      </TableCell>

      {/* Size */}
      <TableCell>{field('size', 'Size')}</TableCell>

      {/* Loại (text tự do) */}
      <TableCell>{field('type', 'Loại')}</TableCell>

      {/* Display Type — enum SELECT */}
      <TableCell className="min-w-[110px]">
        <Select
          value={form.displayType}
          onValueChange={(val) =>
            setForm((prev) => ({ ...prev, displayType: val as VariantDisplayType }))
          }
          disabled={isSaving}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COLOR">COLOR</SelectItem>
            <SelectItem value="IMAGE">IMAGE</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* Giá — optional */}
      <TableCell>
        <div className="relative">
          {field('price', 'Tùy chọn')}
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
            ₫
          </span>
        </div>
      </TableCell>

      {/* Số lượng */}
      <TableCell>{field('quantity', '0')}</TableCell>

      {/* Ngưỡng */}
      <TableCell>{field('lowStockThreshold', '10')}</TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={handleSave}
            disabled={isSaving || !form.name.trim()}
            title="Lưu"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-muted-foreground hover:bg-muted"
            onClick={onCancel}
            disabled={isSaving}
            title="Hủy"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
