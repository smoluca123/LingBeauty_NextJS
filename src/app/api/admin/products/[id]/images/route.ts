import { NextResponse } from 'next/server';
import {
  uploadProductImageAction,
  getProductImagesAction,
} from '@/lib/apis/server/actions/admin-product-image.actions';

/**
 * GET /api/admin/products/[id]/images
 * Fetch all images for a product.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const response = await getProductImagesAction(id);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch images';
    return NextResponse.json({ message }, { status: 500 });
  }
}

/**
 * POST /api/admin/products/[id]/images
 * Upload an image file and attach it to the product in one step.
 *
 * Expected: multipart/form-data
 *   - file       (required)
 *   - isPrimary  (optional, 'true' | 'false')
 *   - alt        (optional)
 *   - variantId  (optional)
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    // Build FormData to forward to BE
    const beFormData = new FormData();
    beFormData.append('file', file);

    const isPrimary = formData.get('isPrimary');
    if (isPrimary !== null) beFormData.append('isPrimary', String(isPrimary));

    const alt = formData.get('alt');
    if (alt !== null) beFormData.append('alt', String(alt));

    const variantId = formData.get('variantId');
    if (variantId !== null) beFormData.append('variantId', String(variantId));

    const response = await uploadProductImageAction(id, beFormData);
    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    return NextResponse.json({ message }, { status: 500 });
  }
}
