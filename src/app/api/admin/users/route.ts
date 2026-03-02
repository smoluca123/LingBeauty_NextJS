import { NextResponse } from 'next/server';
import { getAllUsersAdminAPI } from '@/lib/apis/server/admin-user-apis';
import { createUserAdminAction } from '@/lib/apis/server/actions/admin-user.actions';
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

/**
 * GET /api/admin/users
 * Proxy to GET /user on the backend
 */
export async function GET(
  request: Request,
): Promise<NextResponse<IApiPaginationResponseWrapperType<IUserDataType>>> {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const search = searchParams.get('search');
  const roleId = searchParams.get('roleId');
  const isActive = searchParams.get('isActive');
  const isBanned = searchParams.get('isBanned');
  const isVerified = searchParams.get('isVerified');
  const sortBy = searchParams.get('sortBy') as
    | 'createdAt'
    | 'updatedAt'
    | 'email'
    | 'firstName'
    | 'lastName'
    | null;
  const order = searchParams.get('order') as 'asc' | 'desc' | null;

  const response = await getAllUsersAdminAPI({
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    search: search || undefined,
    roleId: roleId || undefined,
    isActive: isActive !== null ? isActive === 'true' : undefined,
    isBanned: isBanned !== null ? isBanned === 'true' : undefined,
    isVerified: isVerified !== null ? isVerified === 'true' : undefined,
    sortBy: sortBy || undefined,
    order: order || undefined,
  });

  return NextResponse.json(response);
}

/**
 * POST /api/admin/users
 * Proxy to POST /user on the backend (create user by admin)
 */
export async function POST(
  request: Request,
): Promise<NextResponse<IApiResponseWrapperType<IUserDataType>>> {
  const body = await request.json();
  const response = await createUserAdminAction(body);
  return NextResponse.json(response);
}
