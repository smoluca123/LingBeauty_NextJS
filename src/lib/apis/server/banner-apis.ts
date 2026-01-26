'use server';
import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IBannerGroupDataType } from '@/lib/types/interfaces/apis/banner.interfaces';

/**
 * Get active banner group for homepage
 * This is a server-side API call (no auth required)
 */
export const getActiveBannerGroupAPI = async () => {
  try {
    const data = await kyInstance
      .get('public/banners/active', {
        next: {
          revalidate: 300, // Revalidate every 5 minutes
          tags: ['banners'],
        },
      })
      .json<IApiResponseWrapperType<IBannerGroupDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('Error fetching active banner group:', error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
