import { NextResponse } from 'next/server';
import {
  banUserAdminAction,
} from '@/lib/apis/server/actions/admin-user.actions';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

/**
 * PATCH /api/admin/users/[id]/ban
 * Proxy to PATCH /user/:id/ban on the backend
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<IApiResponseWrapperType<IUserDataType>>> {
  const { id } = await params;
  const body: { isBanned: boolean } = await request.json();
  const response = await banUserAdminAction({ id, isBanned: body.isBanned });
  return NextResponse.json(response);
}
