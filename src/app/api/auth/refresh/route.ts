import { env } from '@/lib/env.config';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAuthResponse } from '@/lib/types/interfaces/apis/auth.interfaces';
import { HTTPError } from 'ky';
import ky from 'ky';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const forwardError = async (error: unknown): Promise<NextResponse> => {
  if (error instanceof HTTPError) {
    const errorData = await error.response.json().catch(() => ({}));
    return NextResponse.json(
      { message: errorData.message || 'Request failed' },
      { status: error.response.status },
    );
  }
  return NextResponse.json(
    { message: 'Internal server error' },
    { status: 500 },
  );
};

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: 'No access token found' },
      { status: 401 },
    );
  }

  try {
    const data = await ky
      .post(`${env.NEXT_PUBLIC_API_URL}auth/refresh-token`, {
        json: { accessToken },
        headers: {
          Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
        },
      })
      .json<IApiResponseWrapperType<IAuthResponse>>();

    const opts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    };
    cookieStore.set('accessToken', data.data.accessToken, opts);
    cookieStore.set('userId', data.data.user.id, opts);

    return NextResponse.json({
      message: 'Token refreshed successfully',
      data: { user: data.data.user },
    });
  } catch (error) {
    // Always clear cookies on refresh failure
    cookieStore.delete('accessToken');
    cookieStore.delete('userId');
    return forwardError(error);
  }
}
