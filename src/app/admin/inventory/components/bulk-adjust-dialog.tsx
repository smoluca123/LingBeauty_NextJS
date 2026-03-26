'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBulkAdjustInventoryMutation } from '@/hooks/mutations/admin-inventory.mutation';
import type { InventoryRow } from './inventory-table';
import { isVariantRow } from './inventory-table/helpers';

interface BulkAdjustDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: InventoryRow[];
}

export function BulkAdjustDialog({ open, onOpenChange, items }: BulkAdjustDialogProps) {
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  const { mutate, isPending } = useBulkAdjustInventoryMutation();

  const handleDeltaChange = (inventoryId: string, value: number) => {
    setDeltas((prev) => ({ ...prev, [inventoryId]: value }));
  };

  const handleSubmit = () => {
    const adjustments = items
      .filter((item) => deltas[item.id] !== undefined && deltas[item.id] !== 0)
      .map((item) => ({ inventoryId: item.id, delta: deltas[item.id] }));

    if (adjustments.length === 0) return;

    mutate({ items: adjustments }, { onSuccess: () => onOpenChange(false) });
  };

  const hasChanges = items.some(
    (item) => deltas[item.id] !== undefined && deltas[item.id] !== 0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Điều chỉnh hàng loạt</DialogTitle>
          <DialogDescription>
            Nhập delta (+/-) cho từng sản phẩm. Bỏ trống hoặc để 0 để bỏ qua.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {items.map((item) => {
            const isVariant = isVariantRow(item);
            return (
              <div key={item.id} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.product?.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {item.product?.sku}
                    {isVariant && ` · ${item.variant.name}`}
                  </p>
                  <p className="text-xs text-muted-foreground">Hiện tại: {item.quantity}</p>
                </div>
                <div className="w-28 shrink-0">
                  <Label htmlFor={`delta-${item.id}`} className="sr-only">
                    Delta
                  </Label>
                  <Input
                    id={`delta-${item.id}`}
                    type="number"
                    placeholder="0"
                    className="text-center"
                    value={deltas[item.id] ?? ''}
                    onChange={(e) =>
                      handleDeltaChange(item.id, parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Hủy
          </Button>
          <Button
            variant="primary-pink"
            onClick={handleSubmit}
            disabled={isPending || !hasChanges}
          >
            {isPending ? 'Đang lưu...' : 'Lưu tất cả'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
