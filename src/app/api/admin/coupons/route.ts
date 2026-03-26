import {
  getAllCouponsAPI,
  createCouponAPI,
} from '@/lib/apis/server/admin-coupon-apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { ICreateCouponFormData } from '@/lib/types/interfaces/apis/coupon.interfaces'

// GET /api/admin/coupons - Get all coupons with pagination and filtering
export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page')
    ? Number(searchParams.get('page'))
    : undefined
  const limit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : undefined
  const search = searchParams.get('search') || undefined
  const isActive = searchParams.get('isActive')
    ? searchParams.get('isActive') === 'true'
    : undefined
  const sortBy = searchParams.get('sortBy') as
    | 'createdAt'
    | 'code'
    | 'value'
    | 'usedCount'
    | 'startDate'
    | 'endDate'
    | undefined
  const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined

  return proxyRoute(() =>
    getAllCouponsAPI({ page, limit, search, isActive, sortBy, sortOrder }),
  )
}

// POST /api/admin/coupons - Create new coupon
export const POST = async (req: Request) => {
  const data = (await req.json()) as ICreateCouponFormData
  return proxyRoute(() => createCouponAPI(data))
}
