import { uploadProductImageAPI } from '@/lib/apis/server/admin-product-apis';
import { proxyRoute } from '@/lib/proxy-route';
import { NextResponse } from 'next/server';

// POST /api/admin/products/[id]/upload/image
export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  const { id: productId } = await params;
  const formData = await req.formData();

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json(
      { success: false, message: 'Không tìm thấy file ảnh' },
      { status: 400 },
    );
  }

  const variantId = formData.get('variantId') as string | null;
  const alt = formData.get('alt') as string | null;
  const isPrimary = formData.get('isPrimary') as string | null;

  return proxyRoute(() =>
    uploadProductImageAPI(productId, file, { variantId, alt, isPrimary }),
  );
};
