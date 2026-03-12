export function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(price));
}

export function getStockStatus(quantity: number): {
  label: string;
  variant: 'primary-pink' | 'secondary' | 'destructive';
} {
  if (quantity === 0) {
    return { label: 'Hết hàng', variant: 'destructive' };
  } else if (quantity < 10) {
    return { label: 'Sắp hết', variant: 'secondary' };
  } else {
    return { label: 'Còn hàng', variant: 'primary-pink' };
  }
}
