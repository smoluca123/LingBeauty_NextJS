import {
  deleteMyAddressAPI,
  updateMyAddressAPI,
} from '@/lib/apis/server/actions/addresses.actions';
import { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import {
  IApiResponseWrapperType,
  INextApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { UpdateAddressValues } from '@/lib/zod-schemas/addresses.schema';
import { HTTPError } from 'ky';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ addressId: string }> },
): Promise<
  NextResponse<
    IApiResponseWrapperType<{
      message: string;
    } | null>
  >
> {
  // Get addressId from route params
  const { addressId } = await params;

  if (!addressId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Address ID is required',
        data: null,
        date: new Date(),
        statusCode: 400,
      },
      { status: 400 },
    );
  }

  // Fetch current user from backend
  const response = await deleteMyAddressAPI(addressId);

  // Return only the data part to avoid double wrapping
  return NextResponse.json(response);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ addressId: string }> },
): Promise<
  NextResponse<
    INextApiResponseWrapperType<IApiResponseWrapperType<IAddressDataType> | null>
  >
> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    const body: UpdateAddressValues = await request.json();

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

    // Get addressId from route params
    const { addressId } = await params;
    console.log('addressId', addressId);

    if (!addressId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Address ID is required',
          data: null,
        },
        { status: 400 },
      );
    }

    // Fetch current user from backend
    const response = await updateMyAddressAPI({ id: addressId, data: body });

    // Return only the data part to avoid double wrapping
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
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
