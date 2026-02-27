import { NextResponse } from 'next/server';
import { uploadAvatarServerApi } from '@/lib/apis/server/actions/user-actions';

/**
 * POST /api/me/avatar
 * Proxy route handler – forwards multipart/form-data to the backend
 * via uploadAvatarServerApi (a 'use server' action that handles error
 * serialization the same way as other server actions in this project).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json(
      { message: 'Không tìm thấy file ảnh' },
      { status: 400 },
    );
  }

  const response = await uploadAvatarServerApi(file);
  return NextResponse.json(response);
}
