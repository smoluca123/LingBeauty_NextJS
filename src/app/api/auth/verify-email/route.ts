import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { HTTPError } from 'ky';
import { kyInstance } from '@/lib/kyInstance/ky';

interface VerifyEmailResponse {
  message: string;
  data?: {
    message: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    const data = await kyInstance
      .post('auth/verify-email', {
        json: { code },
        headers: {
          accessToken: accessToken,
        },
      })
      .json<VerifyEmailResponse>();

    return NextResponse.json({
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      return NextResponse.json(
        { message: errorData.message || 'Failed to verify email' },
        { status: error.response.status }
      );
    }
    console.error('Verify email error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
