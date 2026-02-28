import { NextResponse } from 'next/server';
import {
  updateUserAdminAction,
} from '@/lib/apis/server/actions/admin-user.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

/**
 * PATCH /api/admin/users/[id]
 * Proxy to PATCH /user/:id on the backend
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IUserDataType>>> {
  const { id } = await params;
  const body = await request.json();
  const response = await updateUserAdminAction({ id, data: body });
  return NextResponse.json(response);
}
