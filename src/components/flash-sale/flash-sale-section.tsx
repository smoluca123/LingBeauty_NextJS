import { getActiveFlashSaleAPI } from '@/lib/apis/server/flash-sale-apis';
import { FlashSaleContent } from './flash-sale-content';

export async function FlashSaleSection() {
  const flashSale = await getActiveFlashSaleAPI();

  // Don't render if no active flash sale or no products
  if (
    !flashSale ||
    flashSale.status !== 'ACTIVE' ||
    flashSale.products.length === 0
  ) {
    return null;
  }

  return <FlashSaleContent flashSale={flashSale} />;
}
