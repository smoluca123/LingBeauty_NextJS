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

  // Don't render if flash sale has ended
  const endTime = new Date(flashSale.endTime).getTime();
  if (endTime <= new Date().getTime()) {
    return null;
  }

  return <FlashSaleContent flashSale={flashSale} />;
}
