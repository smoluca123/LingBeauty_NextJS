'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useAdjustProductInventoryMutation,
  useUpdateProductInventoryMutation,
  useAdjustVariantInventoryMutation,
  useUpdateVariantInventoryMutation,
} from '@/hooks/mutations/admin-inventory.mutation';
import type { InventoryDisplayStatus } from '@/lib/types/interfaces/apis/admin-inventory.interfaces';
import type { InventoryRow } from './inventory-table';
import { isVariantRow } from './inventory-table/helpers';

interface AdjustInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryRow | null;
}

export function AdjustInventoryDialog({ open, onOpenChange, item }: AdjustInventoryDialogProps) {
  const [delta, setDelta] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(0);
  const [minStockQuantity, setMinStockQuantity] = useState(-10);
  const [displayStatus, setDisplayStatus] = useState<InventoryDisplayStatus>('IN_STOCK');

  const adjustProduct = useAdjustProductInventoryMutation();
  const updateProduct = useUpdateProductInventoryMutation();
  const adjustVariant = useAdjustVariantInventoryMutation();
  const updateVariant = useUpdateVariantInventoryMutation();

  const isPending =
    adjustProduct.isPending ||
    updateProduct.isPending ||
    adjustVariant.isPending ||
    updateVariant.isPending;

  useEffect(() => {
    if (open && item) {
      setDelta(0);
      setQuantity(item.quantity);
      setLowStockThreshold(item.lowStockThreshold);
      setMinStockQuantity(item.minStockQuantity);
      setDisplayStatus(item.displayStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleAdjust = () => {
    if (!item) return;
    const isVariant = isVariantRow(item);

    if (isVariant) {
      adjustVariant.mutate(
        { productId: item.productId, variantId: item.variantId!, payload: { delta } },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      adjustProduct.mutate(
        { productId: item.productId, payload: { delta } },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  const handleUpdate = () => {
    if (!item) return;
    const isVariant = isVariantRow(item);
    const payload = { quantity, lowStockThreshold, minStockQuantity, displayStatus };

    if (isVariant) {
      updateVariant.mutate(
        { productId: item.productId, variantId: item.variantId!, payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      updateProduct.mutate(
        { productId: item.productId, payload },
        { onSuccess: () => onOpenChange(false) },
      );
    }
  };

  const isVariant = item ? isVariantRow(item) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Điều chỉnh kho hàng</DialogTitle>
          <DialogDescription>
            {item?.product?.name}
            {isVariant && item ? ` — ${(item as { variant: { name: string } }).variant.name}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="pb-2 border-b text-sm text-muted-foreground">
          SKU: <span className="font-mono">{item?.product?.sku}</span>
          {' · '}Số lượng hiện tại:{' '}
          <span className="font-semibold text-foreground">{item?.quantity}</span>
        </div>

        <Tabs defaultValue="adjust">
          <TabsList className="w-full">
            <TabsTrigger value="adjust" className="flex-1">
              Điều chỉnh delta
            </TabsTrigger>
            <TabsTrigger value="set" className="flex-1">
              Cập nhật thông tin
            </TabsTrigger>
          </TabsList>

          {/* Tab: Delta adjust */}
          <TabsContent value="adjust" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="delta">Thay đổi (+/-)</Label>
              <Input
                id="delta"
                type="number"
                value={delta}
                onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
                placeholder="Ví dụ: +10 hoặc -5"
              />
              <p className="text-xs text-muted-foreground">
                Số dương để thêm, số âm để bớt. Kết quả không được âm.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <Button
                variant="primary-pink"
                onClick={handleAdjust}
                disabled={isPending || delta === 0}
              >
                {adjustProduct.isPending || adjustVariant.isPending ? 'Đang lưu...' : 'Điều chỉnh'}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* Tab: Set absolute */}
          <TabsContent value="set" className="space-y-4 pt-4">
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
                <p className="text-xs text-muted-foreground">Hiện tại: {item?.quantity}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Ngưỡng cảnh báo</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Hiện tại: {item?.lowStockThreshold}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minStock">Tồn kho tối thiểu</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={minStockQuantity}
                  onChange={(e) => setMinStockQuantity(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-muted-foreground">
                  Hiện tại: {item?.minStockQuantity}. Âm cho phép đặt trước.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayStatus">Trạng thái hiển thị</Label>
                <Select
                  value={displayStatus}
                  onValueChange={(v) => setDisplayStatus(v as InventoryDisplayStatus)}
                >
                  <SelectTrigger id="displayStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_STOCK">Còn hàng</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Hiện tại: {item?.displayStatus === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy
              </Button>
              <Button variant="primary-pink" onClick={handleUpdate} disabled={isPending}>
                {updateProduct.isPending || updateVariant.isPending ? 'Đang lưu...' : 'Cập nhật'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
