import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IValidateTokenResponseType } from '@/lib/types/interfaces/apis/auth.interfaces';
import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * This route has custom response shaping and cookie-clearing logic on 401,
 * so it cannot be a pure proxy — we handle it explicitly.
 */
export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const userId = cookieStore.get('userId')?.value;

  if (!accessToken || !userId) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  try {
    const data = await kyInstance
      .get('auth/validate-token', { headers: { accessToken } })
      .json<IApiResponseWrapperType<IValidateTokenResponseType>>();

    return NextResponse.json({
      isAuthenticated: data.data.valid,
      user: data.data.user,
      expiresAt: data.data.expiresAt,
    });
  } catch (error) {
    // Clear cookies if token is invalid/expired
    if (error instanceof HTTPError && error.response.status === 401) {
      cookieStore.delete('accessToken');
      cookieStore.delete('userId');
    }
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
}
