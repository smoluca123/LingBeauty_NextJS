'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InventoryItem } from './inventory-table';

interface AdjustInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function AdjustInventoryDialog({
  open,
  onOpenChange,
  item,
}: AdjustInventoryDialogProps) {
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(0);

  // Reset values when dialog opens with a new item
  useEffect(() => {
    if (open && item) {
      setQuantity(item.quantity);
      setLowStockThreshold(item.lowStockThreshold);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = () => {
    console.log('Adjusting inventory:', {
      id: item?.id,
      quantity,
      lowStockThreshold,
    });
    // TODO: API call to update inventory
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Điều chỉnh kho hàng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Product Info */}
          <div className="pb-2 border-b">
            <p className="font-medium text-base">{item?.productName}</p>
            <p className="text-sm text-muted-foreground">
              SKU: {item?.productSku}
            </p>
          </div>

          {/* Quantity & Threshold */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng tồn kho</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">
                Hiện tại: {item?.quantity}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="threshold">Ngưỡng cảnh báo</Label>
              <Input
                id="threshold"
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) =>
                  setLowStockThreshold(parseInt(e.target.value) || 0)
                }
              />
              <p className="text-xs text-muted-foreground">
                Hiện tại: {item?.lowStockThreshold}
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} variant="primary-pink">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
