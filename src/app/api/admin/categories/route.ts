import { NextResponse } from 'next/server';
import { getAdminCategoriesAPI } from '@/lib/apis/server/admin-category-apis';
import { createCategoryAction } from '@/lib/apis/server/actions/admin-category.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

/**
 * GET /api/admin/categories
 * Returns the full category tree
 */
export async function GET(): Promise<
  NextResponse<IApiResponseWrapperType<IAdminCategoryDataType[]>>
> {
  const response = await getAdminCategoriesAPI();
  return NextResponse.json(response);
}

/**
 * POST /api/admin/categories
 * Create a root-level category
 */
export async function POST(
  request: Request,
): Promise<NextResponse<IApiResponseWrapperType<IAdminCategoryDataType>>> {
  const body = await request.json();
  const response = await createCategoryAction(body);
  return NextResponse.json(response);
}
