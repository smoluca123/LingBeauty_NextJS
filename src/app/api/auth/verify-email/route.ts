import { proxyRoute } from '@/lib/proxy-route';
import { kyInstance } from '@/lib/kyInstance/ky';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

interface VerifyEmailResponse {
  message: string;
  data?: { message: string };
}

export const POST = async (request: NextRequest) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const body = await request.json();
  return proxyRoute(() =>
    kyInstance
      .post('auth/verify-email', {
        json: { code: body.code },
        headers: { accessToken: accessToken ?? '' },
      })
      .json<VerifyEmailResponse>(),
  );
};
