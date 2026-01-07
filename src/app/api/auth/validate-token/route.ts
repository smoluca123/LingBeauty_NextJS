import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { HTTPError } from 'ky';
import { kyInstance } from '@/lib/kyInstance/ky';
import { IValidateTokenResponseType } from '@/lib/types/interfaces/apis/auth.interfaces';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const userId = cookieStore.get('userId')?.value;

    if (!accessToken || !userId) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null,
      });
    }

    // Fetch current user from backend using ky
    const data = await kyInstance
      .get('auth/validate-token', {
        headers: {
          accessToken: accessToken,
        },
      })
      .json<IApiResponseWrapperType<IValidateTokenResponseType>>();
    return NextResponse.json({
      isAuthenticated: data.data.valid,
      user: data.data.user,
      expiresAt: data.data.expiresAt,
    });
  } catch (error) {
    // Token might be invalid, clear cookies
    if (error instanceof HTTPError && error.response.status === 401) {
      const cookieStore = await cookies();
      cookieStore.delete('accessToken');
      cookieStore.delete('userId');
    }

    return NextResponse.json({
      isAuthenticated: false,
      user: null,
    });
  }
}
