import { TopProducts } from '@/components/home/products/top-products-section/top-products';
import { getProductsAPI } from '@/lib/apis/server/product-apis';

export async function TopProductsSection() {
  const initialData = await getProductsAPI({ page: 1 });

  return <TopProducts initialData={initialData} />;
}
