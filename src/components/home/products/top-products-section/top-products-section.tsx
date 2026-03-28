import { TopProducts } from '@/components/home/products/top-products-section/top-products'
import { getHotProductsAPI } from '@/lib/apis/server/product-apis'

export async function TopProductsSection() {
  const initialData = await getHotProductsAPI({
    limit: 10,
    criteria: 'composite',
    period: '30d',
  })

  return <TopProducts initialData={initialData} />
}
