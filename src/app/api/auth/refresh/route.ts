import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ky, { HTTPError } from 'ky';
import { env } from '@/lib/env.config';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAuthResponse } from '@/lib/types/interfaces/apis/auth.interfaces';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'No access token found' },
        { status: 401 }
      );
    }

    const data = await ky
      .post(`${env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        json: { accessToken },
        headers: {
          Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
        },
      })
      .json<IApiResponseWrapperType<IAuthResponse>>();

    // Update cookies with new token
    cookieStore.set('accessToken', data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('userId', data.data.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      message: 'Token refreshed successfully',
      data: { user: data.data.user },
    });
  } catch (error) {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('userId');

    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      return NextResponse.json(
        { message: errorData.message || 'Token refresh failed' },
        { status: error.response.status }
      );
    }
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
