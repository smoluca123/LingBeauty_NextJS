import {
  getAllAdminProductsAPI,
  createAdminProductAPI,
} from '@/lib/apis/server/admin-product-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { IAdminProductFilters } from '@/lib/types/interfaces/apis/admin-product.interfaces'
import type { ICreateProductPayload } from '@/lib/types/interfaces/apis/admin-product.interfaces'

// GET /api/admin/products
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)

  const params: IAdminProductFilters = {
    page: searchParams.has('page')
      ? Number(searchParams.get('page'))
      : undefined,
    limit: searchParams.has('limit')
      ? Number(searchParams.get('limit'))
      : undefined,
    search: searchParams.get('search') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    brandId: searchParams.get('brandId') ?? undefined,
    isActive: searchParams.has('isActive')
      ? searchParams.get('isActive') === 'true'
      : undefined,
    isFeatured: searchParams.has('isFeatured')
      ? searchParams.get('isFeatured') === 'true'
      : undefined,
    minPrice: searchParams.has('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.has('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
    sortBy:
      (searchParams.get('sortBy') as IAdminProductFilters['sortBy']) ??
      undefined,
    order:
      (searchParams.get('order') as IAdminProductFilters['order']) ?? undefined,
  }

  return proxyRoute(() => getAllAdminProductsAPI(params))
}

// POST /api/admin/products
export const POST = async (req: Request) => {
  const body = (await req.json()) as ICreateProductPayload
  return proxyRoute(() => createAdminProductAPI(body))
}
