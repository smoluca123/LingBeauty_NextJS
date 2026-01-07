import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ky, { HTTPError } from 'ky';
import { env } from '@/lib/env.config';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IAuthResponse } from '@/lib/types/interfaces/apis/auth.interfaces';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const data = await ky
      .post(`${env.NEXT_PUBLIC_API_URL}auth/login`, {
        json: { email, password },
        headers: {
          Authorization: `Bearer ${env.NEXT_PUBLIC_AUTHORIZATION_TOKEN}`,
        },
      })
      .json<IApiResponseWrapperType<IAuthResponse>>();

    // Set HTTP-only cookies
    const cookieStore = await cookies();

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
      message: data.message,
      data: { user: data.data.user },
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      return NextResponse.json(
        { message: errorData.message || 'Login failed' },
        { status: error.response.status }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
