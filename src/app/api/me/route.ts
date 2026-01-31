import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { HTTPError } from 'ky';
import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

/**
 * GET /api/me - Get current user information
 * Requires accessToken cookie
 * Returns user data or null if not authenticated
 */
export async function GET() {
  try {
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

    // Fetch current user from backend
    const response = await kyInstance
      .get('user/me', {
        headers: {
          accessToken: 'Bearer ' + accessToken,
        },
      })
      .json<IApiResponseWrapperType<IUserDataType>>();

    console.log(response);

    return NextResponse.json({
      success: true,
      message: 'User retrieved successfully',
      data: response.data,
    });
  } catch (error) {
    // Handle authentication errors
    if (error instanceof HTTPError) {
      if (error.response.status === 401) {
        // Token invalid or expired, clear cookies
        const cookieStore = await cookies();
        cookieStore.delete('accessToken');
        cookieStore.delete('userId');

        return NextResponse.json(
          {
            success: false,
            message: 'Invalid or expired token',
            data: null,
          },
          { status: 401 },
        );
      }

      // Other HTTP errors
      const errorData = await error.response.json();
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to fetch user',
          data: null,
        },
        { status: error.response.status },
      );
    }

    // Generic server error
    console.error('GET /api/me error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        data: null,
      },
      { status: 500 },
    );
  }
}
