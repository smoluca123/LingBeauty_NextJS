import { NextResponse } from 'next/server';
import {
  updateProductImageAction,
  deleteProductImageAction,
  IUpdateProductImagePayload,
} from '@/lib/apis/server/actions/admin-product-image.actions';

/**
 * PATCH /api/admin/products/[id]/images/[imageId]
 * Update product image (e.g. set as primary)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
): Promise<NextResponse> {
  try {
    const { id, imageId } = await params;
    const body: IUpdateProductImagePayload = await request.json();
    const response = await updateProductImageAction(id, imageId, body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update image';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products/[id]/images/[imageId]
 * Delete a product image
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; imageId: string }> },
): Promise<NextResponse> {
  try {
    const { id, imageId } = await params;
    const response = await deleteProductImageAction(id, imageId);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete image';
    return NextResponse.json({ message }, { status: 500 });
  }
}
