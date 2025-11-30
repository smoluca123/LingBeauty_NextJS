import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const setCookieApi = async ({
  key,
  value,
  options,
}: {
  key: string;
  value: string;
  options: Partial<ResponseCookie>;
}) => {
  try {
    const response = await kyNextInstance('cookie', {
      method: 'POST',
      body: JSON.stringify({ key, value, options }),
    }).json<{ message: string }>();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.error;
    }
    throw error.message;
  }
};

export const getCookieApi = async ({ key }: { key: string }) => {
  try {
    const response = await kyNextInstance('cookie', {
      method: 'GET',
      searchParams: { key },
    }).json<{ value: string }>();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.error;
    }
    throw error.message;
    // throw new Error(error as string);
  }
};

export const deleteCookieApi = async ({ key }: { key: string }) => {
  try {
    const response = await kyNextInstance('cookie', {
      method: 'DELETE',
      body: JSON.stringify({ key }),
    }).json<{ message: string }>();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.error;
    }
    throw error.message;
  }
};
