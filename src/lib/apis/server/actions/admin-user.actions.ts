'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import { HTTPError } from 'ky';

export interface IUpdateUserAdminPayload {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  username?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isBanned?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export interface ICreateUserAdminPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  roleId?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export const updateUserAdminAction = async ({
  id,
  data,
}: {
  id: string;
  data: IUpdateUserAdminPayload;
}): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const response = await kyInstance
      .patch(`user/${id}`, { json: data })
      .json<IApiResponseWrapperType<IUserDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }
    throw error;
  }
};

export const banUserAdminAction = async ({
  id,
  isBanned,
}: {
  id: string;
  isBanned: boolean;
}): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const response = await kyInstance
      .patch(`user/${id}/ban`, { json: { isBanned } })
      .json<IApiResponseWrapperType<IUserDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to update ban status');
    }
    throw error;
  }
};

export const createUserAdminAction = async (
  data: ICreateUserAdminPayload,
): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const response = await kyInstance
      .post('user', { json: data })
      .json<IApiResponseWrapperType<IUserDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }
    throw error;
  }
};
