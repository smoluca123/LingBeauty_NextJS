import { NextResponse } from 'next/server';
import { getAdminProductsAPI } from '@/lib/apis/server/admin-product-apis';
import { createProductAction } from '@/lib/apis/server/actions/admin-product.actions';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

/**
 * GET /api/admin/products
 * Returns paginated product list with filters
 */
export async function GET(
  request: Request,
): Promise<NextResponse<IApiPaginationResponseWrapperType<IAdminProductDataType> | { message: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');
    const brandId = searchParams.get('brandId');
    const isActive = searchParams.get('isActive');
    const isFeatured = searchParams.get('isFeatured');
    const sortBy = searchParams.get('sortBy') as
      | 'name'
      | 'basePrice'
      | 'createdAt'
      | 'updatedAt'
      | null;
    const order = searchParams.get('order') as 'asc' | 'desc' | null;

    const response = await getAdminProductsAPI({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search: search || undefined,
      categoryId: categoryId || undefined,
      brandId: brandId || undefined,
      isActive: isActive !== null ? isActive === 'true' : undefined,
      isFeatured: isFeatured !== null ? isFeatured === 'true' : undefined,
      sortBy: sortBy || undefined,
      order: order || undefined,
    });

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(
  request: Request,
): Promise<NextResponse<IApiResponseWrapperType<IAdminProductDataType> | { message: string }>> {
  try {
    const body = await request.json();
    const response = await createProductAction(body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ message }, { status: 500 });
  }
}
