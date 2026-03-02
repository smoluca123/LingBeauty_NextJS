import { NextResponse } from 'next/server';
import {
  updateBadgeAction,
  deleteBadgeAction,
} from '@/lib/apis/server/actions/admin-badge.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IProductBadgeDataType } from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * PATCH /api/admin/products/[id]/badges/[badgeId]
 * Proxy to PATCH /product/:id/badges/:badgeId on the backend
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; badgeId: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IProductBadgeDataType> | { message: string }>> {
  try {
    const { id, badgeId } = await params;
    const body = await request.json();
    const response = await updateBadgeAction(id, badgeId, body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update badge';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products/[id]/badges/[badgeId]
 * Proxy to DELETE /product/:id/badges/:badgeId on the backend
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; badgeId: string }> },
): Promise<NextResponse<IApiResponseWrapperType<{ message: string }> | { message: string }>> {
  try {
    const { id, badgeId } = await params;
    const response = await deleteBadgeAction(id, badgeId);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete badge';
    return NextResponse.json({ message }, { status: 500 });
  }
}
