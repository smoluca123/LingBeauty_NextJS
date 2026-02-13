import { Badge } from '@/components/ui/badge';
import { mockAdminProducts } from '@/lib/mock-data/admin';

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  quantity: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export function getInventoryData(): InventoryItem[] {
  return mockAdminProducts.map((product) => ({
    id: product.id,
    productId: product.id,
    productName: product.name,
    productSku: product.sku,
    productImage: product.primaryImage,
    quantity: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    status:
      product.stock === 0
        ? 'out_of_stock'
        : product.stock <= product.lowStockThreshold
          ? 'low_stock'
          : 'in_stock',
  }));
}

export function getStatusBadge(status: InventoryItem['status']) {
  switch (status) {
    case 'in_stock':
      return <Badge variant="primary-pink">Còn hàng</Badge>;
    case 'low_stock':
      return <Badge variant="secondary">Sắp hết</Badge>;
    case 'out_of_stock':
      return <Badge variant="destructive">Hết hàng</Badge>;
  }
}
