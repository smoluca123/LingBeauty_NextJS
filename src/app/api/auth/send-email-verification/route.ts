import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { HTTPError } from 'ky';
import { kyInstance } from '@/lib/kyInstance/ky';

interface SendOTPResponse {
  message: string;
  data?: {
    message: string;
    code?: string;
  };
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await kyInstance
      .post('auth/send-email-verification', {
        headers: {
          accessToken: accessToken,
        },
      })
      .json<SendOTPResponse>();

    return NextResponse.json({
      message: data.message,
      data: data.data,
    });
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      return NextResponse.json(
        {
          message: errorData.message || 'Failed to send verification email',
          details: errorData.details,
        },
        { status: error.response.status }
      );
    }
    console.error('Send email verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
