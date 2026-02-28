import { env } from '@/lib/env.config';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAuthResponse } from '@/lib/types/interfaces/apis/auth.interfaces';
import { HTTPError } from 'ky';
import ky from 'ky';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Helper: set access token cookies after successful auth
const setAuthCookies = async (data: IApiResponseWrapperType<IAuthResponse>) => {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
  cookieStore.set('accessToken', data.data.accessToken, opts);
  cookieStore.set('userId', data.data.user.id, opts);
};

// Helper: forward HTTPError from BE as JSON
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

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const data = await ky
      .post(`${env.NEXT_PUBLIC_API_URL}auth/login`, {
        json: { email, password },
        headers: {
          Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
        },
      })
      .json<IApiResponseWrapperType<IAuthResponse>>();

    await setAuthCookies(data);
    return NextResponse.json({
      message: data.message,
      data: { user: data.data.user },
    });
  } catch (error) {
    return forwardError(error);
  }
}
