import { NextResponse } from 'next/server';
import {
  createVariantAction,
  getProductVariantsAction,
} from '@/lib/apis/server/actions/admin-variant.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IProductVariantDataType } from '@/lib/types/interfaces/apis/product.interfaces';

/**
 * GET /api/admin/products/[id]/variants
 * Proxy to GET /product/:id/variants on the backend
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IProductVariantDataType[]> | { message: string }>> {
  try {
    const { id } = await params;
    const response = await getProductVariantsAction(id);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch variants';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * POST /api/admin/products/[id]/variants
 * Proxy to POST /product/:id/variants on the backend
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IProductVariantDataType> | { message: string }>> {
  try {
    const { id } = await params;
    const body = await request.json();
    const response = await createVariantAction(id, body);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create variant';
    return NextResponse.json({ message }, { status: 500 });
  }
}
