import { Products } from '@/components/home/products/products-section/products'
import { getProductsAPI } from '@/lib/apis/server/product-apis'

export async function ProductsSection() {
  const initialData = await getProductsAPI({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    order: 'desc',
  })

  return <Products initialData={initialData} />
}
