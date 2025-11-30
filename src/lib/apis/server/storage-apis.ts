import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import {
  IDownloadSessionWithFileAndUserDataType,
  IFileDataType,
} from '@/lib/types/interfaces/storage.interfaces';
import {
  UpdateDownloadSessionSchema,
  updateDownloadSessionSchema,
} from '@/lib/zod-schemas/storage-api.schemas';

export const getFileDetailAPI = async ({ id }: { id: string }) => {
  try {
    const response = await kyInstance
      .get(`storage/file/${id}`, {
        cache: 'force-cache',
        next: {
          revalidate: 60 * 5, // 5 minutes
        },
      })
      .json<IApiResponseWrapperType<IFileDataType>>();

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const initiateDownloadAPI = async ({ fileId }: { fileId: string }) => {
  try {
    const response = await kyInstance
      .post(`storage/initiate-download-session/${fileId}`)
      .json<IApiResponseWrapperType<IDownloadSessionWithFileAndUserDataType>>();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const getDownloadSessionAPI = async ({ id }: { id: string }) => {
  try {
    const response = await kyInstance
      .get(`storage/get-download-session/${id}`)
      .json<IApiResponseWrapperType<IDownloadSessionWithFileAndUserDataType>>();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const updateDownloadSessionAPI = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateDownloadSessionSchema;
}) => {
  try {
    const validatedData = updateDownloadSessionSchema.parse(payload);
    const response = await kyInstance
      .post(`storage/update-download-session/${id}`, {
        json: validatedData,
      })
      .json<IApiResponseWrapperType<IDownloadSessionWithFileAndUserDataType>>();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const completeDownloadSessionAPI = async ({ id }: { id: string }) => {
  try {
    const response = await kyInstance
      .post(`storage/complete-download-session/${id}`)
      .json<
        IApiResponseWrapperType<
          IDownloadSessionWithFileAndUserDataType & { downloadUrl: string }
        >
      >();
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
