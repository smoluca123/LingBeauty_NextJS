import {
  addMyAddressAPI,
  getMyAddressesAPI,
} from '@/lib/apis/server/addresses.apis';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
  INextApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { AddressFormValues } from '@/lib/zod-schemas/addresses.schema';
import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * GET /api/me/address - Get current user addresses
 * Requires accessToken cookie
 * Returns paginated addresses or null if not authenticated
 */
export async function GET(
  request: Request,
): Promise<
  NextResponse<
    INextApiResponseWrapperType<IApiPaginationResponseWrapperType<IAddressDataType> | null>
  >
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('search');

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
    console.log('limit', limit);
    console.log('page', page);
    console.log('search', search);
    // Fetch current user from backend
    const response = await getMyAddressesAPI({
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      search: search || undefined,
    });

    // Return only the data part to avoid double wrapping
    return NextResponse.json({
      success: true,
      message: 'Addresses retrieved successfully',
      data: response,
    });
  } catch (error) {
    console.log(error);
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
          message: errorData.message || 'Failed to fetch addresses',
          data: null,
        },
        { status: error.response.status },
      );
    }

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

export async function POST(
  request: Request,
): Promise<
  NextResponse<
    INextApiResponseWrapperType<IApiResponseWrapperType<IAddressDataType> | null>
  >
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const body: AddressFormValues = await request.json();

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
    const response = await addMyAddressAPI(body);

    // Return only the data part to avoid double wrapping
    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      data: response,
    });
  } catch (error) {
    console.log(error);
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
          message: errorData.message || 'Failed to fetch addresses',
          data: null,
        },
        { status: error.response.status },
      );
    }

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
