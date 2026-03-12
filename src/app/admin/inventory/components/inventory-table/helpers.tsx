import { Badge } from '@/components/ui/badge';
import type { IInventoryProductItem, IInventoryVariantItem } from '@/lib/types/interfaces/apis/admin-inventory.interfaces';

export type InventoryRow = IInventoryProductItem | IInventoryVariantItem;

/** Kiểm tra xem row có phải là variant-level hay không */
export const isVariantRow = (row: InventoryRow): row is IInventoryVariantItem =>
  row.variantId !== null && 'variant' in row;

/** Tính trạng thái hiển thị bao gồm low_stock (BE không có trạng thái này) */
export type DisplayStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export const getDetailedStatus = (row: InventoryRow): DisplayStatus => {
  if (row.displayStatus === 'OUT_OF_STOCK') return 'out_of_stock';
  if (row.quantity > 0 && row.quantity <= row.lowStockThreshold) return 'low_stock';
  return 'in_stock';
};

export function getStatusBadge(status: DisplayStatus) {
  switch (status) {
    case 'in_stock':
      return <Badge variant="primary-pink">Còn hàng</Badge>;
    case 'low_stock':
      return <Badge variant="secondary">Sắp hết</Badge>;
    case 'out_of_stock':
      return <Badge variant="destructive">Hết hàng</Badge>;
  }
}
