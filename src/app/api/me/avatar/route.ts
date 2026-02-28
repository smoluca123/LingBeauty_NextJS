import { uploadAvatarServerApi } from '@/lib/apis/server/actions/user-actions';
import { proxyRoute } from '@/lib/proxy-route';

export const POST = async (request: Request) => {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    // This is a client-side validation, not a BE error — handle locally
    const { NextResponse } = await import('next/server');
    return NextResponse.json(
      { success: false, message: 'Không tìm thấy file ảnh' },
      { status: 400 },
    );
  }

  return proxyRoute(() => uploadAvatarServerApi(file));
};
