import { NextResponse } from 'next/server';
import {
  getProductBadgesAction,
  createBadgeAction,
} from '@/lib/apis/server/actions/admin-badge.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IProductBadgeDataType } from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * GET /api/admin/products/[id]/badges
 * Proxy to GET /product/:id/badges on the backend
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IProductBadgeDataType[]> | { message: string }>> {
  try {
    const { id } = await params;
    const response = await getProductBadgesAction(id);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch badges';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * POST /api/admin/products/[id]/badges
 * Proxy to POST /product/:id/badges on the backend
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IProductBadgeDataType> | { message: string }>> {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await createBadgeAction(id, body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create badge';
    return NextResponse.json({ message }, { status: 500 });
  }
}
