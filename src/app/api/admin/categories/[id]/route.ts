import { NextResponse } from 'next/server';
import {
  updateCategoryAction,
  deleteCategoryAction,
} from '@/lib/apis/server/actions/admin-category.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAdminCategoryDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

/**
 * PATCH /api/admin/categories/[id]
 * Update a category by ID
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IAdminCategoryDataType>>> {
  const { id } = await params;
  const body = await request.json();
  const response = await updateCategoryAction(id, body);
  return NextResponse.json(response);
}

/**
 * DELETE /api/admin/categories/[id]
 * Delete a category by ID
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IAdminCategoryDataType>>> {
  const { id } = await params;
  const response = await deleteCategoryAction(id);
  return NextResponse.json(response);
}
