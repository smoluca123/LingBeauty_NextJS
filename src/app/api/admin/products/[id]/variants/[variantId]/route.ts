import { NextResponse } from 'next/server';
import {
  updateVariantAction,
  deleteVariantAction,
} from '@/lib/apis/server/actions/admin-variant.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * PATCH /api/admin/products/[id]/variants/[variantId]
 * Proxy to PATCH /product/:id/variants/:variantId on the backend
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IProductVariantDataType> | { message: string }>> {
  try {
    const { id, variantId } = await params;
    const body = await request.json();
    const response = await updateVariantAction(id, variantId, body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update variant';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products/[id]/variants/[variantId]
 * Proxy to DELETE /product/:id/variants/:variantId on the backend
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; variantId: string }> },
): Promise<NextResponse<IApiResponseWrapperType<{ message: string }> | { message: string }>> {
  try {
    const { id, variantId } = await params;
    const response = await deleteVariantAction(id, variantId);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete variant';
    return NextResponse.json({ message }, { status: 500 });
  }
}
