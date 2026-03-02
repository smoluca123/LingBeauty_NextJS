import { NextResponse } from 'next/server';
import { createMultipleBadgesAction } from '@/lib/apis/server/actions/admin-badge.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IProductBadgeDataType } from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * POST /api/admin/products/[id]/badges/bulk
 * Proxy to POST /product/:id/badges/bulk on the backend
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IProductBadgeDataType[]> | { message: string }>> {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await createMultipleBadgesAction(id, body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create badges';
    return NextResponse.json({ message }, { status: 500 });
  }
}
