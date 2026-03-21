import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import { extractErrorMessage } from '@/lib/utils/utils';
import { UpdateUserInfomationValues } from '@/lib/zod-schemas/user-schema';

// ============ Upload Avatar ============
// Calls the Next.js proxy route handler, which forwards to the real backend.
// The backend URL and auth token never leave the server.
export const uploadAvatarAPI = async ({
  avatar,
}: {
  avatar: File;
}): Promise<IApiResponseWrapperType<IUserDataType>> => {
  const formData = new FormData();
  formData.append('file', avatar);
  try {
    const data = await kyNextInstance
      .post('me/avatar', { body: formData })
      .json<IApiResponseWrapperType<IUserDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw await extractErrorMessage(error, 'Cập nhật ảnh đại diện thất bại');
  }
};

// ============ Update My Information ============
export const updateMyInformationAPI = async (
  userData: UpdateUserInfomationValues,
) => {
  try {
    const data = await kyNextInstance
      .patch(`me`, { json: userData })
      .json<IApiResponseWrapperType<IUserDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw await extractErrorMessage(error, 'Cập nhật thông tin thất bại');
  }
};
