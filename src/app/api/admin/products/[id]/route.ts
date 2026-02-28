import { NextResponse } from 'next/server';
import {
  updateProductAction,
  deleteProductAction,
} from '@/lib/apis/server/actions/admin-product.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAdminProductDataType } from '@/lib/types/interfaces/apis/admin-product.interfaces';

/**
 * PATCH /api/admin/products/[id]
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IAdminProductDataType> | { message: string }>> {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await updateProductAction(id, body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products/[id]
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IAdminProductDataType> | { message: string }>> {
  try {
    const { id } = await params;
    const response = await deleteProductAction(id);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ message }, { status: 500 });
  }
}
