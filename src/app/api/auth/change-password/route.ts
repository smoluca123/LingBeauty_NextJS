import { changeUserPasswordAPI } from '@/lib/apis/server/auth-api';
import { ChangePasswordValues } from '@/lib/zod-schemas/auth.schema';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body: ChangePasswordValues = await request.json();
    console.log(body);
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not authenticated',
          data: null,
        },
        { status: 401 },
      );
    }

    const response = await changeUserPasswordAPI(body);
    return NextResponse.json({
      success: true,
      message: response.message,
      data: response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: (error as string) || 'Failed to change password',
        data: null,
      },
      { status: 500 },
    );
  }
}
