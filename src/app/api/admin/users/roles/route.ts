import { NextResponse } from 'next/server';
import { getAllUserRolesAPI } from '@/lib/apis/server/admin-user-apis';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IUserRoleDataType } from '@/lib/types/interfaces/apis/user.interfaces';

/**
 * GET /api/admin/users/roles
 * Proxy to GET /user/roles on the backend
 */
export async function GET(): Promise<
  NextResponse<IApiResponseWrapperType<IUserRoleDataType[]>>
> {
  const response = await getAllUserRolesAPI();
  return NextResponse.json(response);
}
