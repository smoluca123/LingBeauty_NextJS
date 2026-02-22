import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

export const getMeApi = async () => {
  try {
    const data = await kyInstance
      .get('user/me')
      .json<IApiResponseWrapperType<IUserDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
