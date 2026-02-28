import { changeUserPasswordAPI } from '@/lib/apis/server/actions/auth-actions';
import { proxyRoute } from '@/lib/proxy-route';
import type { ChangePasswordValues } from '@/lib/zod-schemas/auth.schema';
import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const body: ChangePasswordValues = await request.json();
  return proxyRoute(() => changeUserPasswordAPI(body));
};
