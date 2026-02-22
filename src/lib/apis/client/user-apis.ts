import { kyClientInstance } from '@/lib/kyInstance/kyClient';
import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import { UpdateUserInfomationValues } from '@/lib/zod-schemas/user-schema';

export const updateAvatarAPI = async ({
  avatar,
}: {
  avatar: File;
}): Promise<IApiResponseWrapperType<IUserDataType>> => {
  const formData = new FormData();
  formData.append('file', avatar);
  try {
    const data = await kyClientInstance
      .put('user/me/avatar', {
        body: formData,
      })
      .json<IApiResponseWrapperType<IUserDataType>>();

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw new Error(error as string);
  }
};

export const updateMyInformationAPI = async (
  userData: UpdateUserInfomationValues,
) => {
  try {
    const data = await kyNextInstance
      .patch(`me`, {
        json: userData,
      })
      .json<IApiResponseWrapperType<IUserDataType>>();

    return data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
    // throw error;
  }
};
