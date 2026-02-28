import { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';
import { CategoryOption } from './product-form.types';

// ─── Price Formatting ─────────────────────────────────────────────────────────

export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(price));
}

// ─── Stock Status ─────────────────────────────────────────────────────────────

export function getStockStatusFromDisplay(displayStatus?: string): {
  label: string;
  variant: 'primary-pink' | 'secondary' | 'destructive';
} {
  if (!displayStatus || displayStatus === 'out_of_stock') {
    return { label: 'Hết hàng', variant: 'destructive' };
  } else if (displayStatus === 'low_stock') {
    return { label: 'Sắp hết', variant: 'secondary' };
  } else {
    return { label: 'Còn hàng', variant: 'primary-pink' };
  }
}

// ─── Category Helpers ─────────────────────────────────────────────────────────

export function flattenCategories(
  cats: IAdminCategoryDataType[],
  depth = 0,
): CategoryOption[] {
  return cats.flatMap((cat) => [
    { id: cat.id, name: cat.name, label: `${'— '.repeat(depth)}${cat.name}` },
    ...(cat.children?.length ? flattenCategories(cat.children, depth + 1) : []),
  ]);
}

// ─── SKU Generator ────────────────────────────────────────────────────────────

export function generateSku(name: string): string {
  const prefix = name
    .slice(0, 3)
    .toUpperCase()
    .replace(/[^A-Z]/g, 'X');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${random}`;
}
