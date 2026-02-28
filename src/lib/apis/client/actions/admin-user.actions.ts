'use client';

import { kyNextInstance } from '@/lib/kyInstance/kyNext';
import { IApiPaginationResponseWrapperType, IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import { IUserDataType, IUserRoleDataType } from '@/lib/types/interfaces/apis/user.interfaces';
import { HTTPError } from 'ky';

export interface IAdminUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isBanned?: boolean;
  isVerified?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'email' | 'firstName' | 'lastName';
  order?: 'asc' | 'desc';
}

export const getAllUsersAdminAPI = async (
  params: IAdminUserQueryParams = { page: 1, limit: 10 },
): Promise<IApiPaginationResponseWrapperType<IUserDataType>> => {
  try {
    const searchParams: Record<string, string> = {};
    if (params.page) searchParams.page = String(params.page);
    if (params.limit) searchParams.limit = String(params.limit);
    if (params.search) searchParams.search = params.search;
    if (params.isActive !== undefined) searchParams.isActive = String(params.isActive);
    if (params.isBanned !== undefined) searchParams.isBanned = String(params.isBanned);
    if (params.isVerified !== undefined) searchParams.isVerified = String(params.isVerified);
    if (params.sortBy) searchParams.sortBy = params.sortBy;
    if (params.order) searchParams.order = params.order;

    const response = await kyNextInstance
      .get('admin/users', { searchParams })
      .json<IApiPaginationResponseWrapperType<IUserDataType>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }
    throw error;
  }
};

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

export const updateUserAdminAPI = async ({
  id,
  data,
}: {
  id: string;
  data: IUpdateUserAdminPayload;
}): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const response = await kyNextInstance
      .patch(`admin/users/${id}`, { json: data })
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

export const banUserAdminAPI = async ({
  id,
  isBanned,
}: {
  id: string;
  isBanned: boolean;
}): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const response = await kyNextInstance
      .patch(`admin/users/${id}/ban`, { json: { isBanned } })
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

export const createUserAdminAPI = async (
  data: ICreateUserAdminPayload,
): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const response = await kyNextInstance
      .post('admin/users', { json: data })
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

export const getAllUserRolesAPI = async (): Promise<
  IApiResponseWrapperType<IUserRoleDataType[]>
> => {
  try {
    const response = await kyNextInstance
      .get('admin/users/roles')
      .json<IApiResponseWrapperType<IUserRoleDataType[]>>();
    return response;
  } catch (error) {
    if (error instanceof HTTPError) {
      const errorData = await error.response.json();
      throw new Error(errorData.message || 'Failed to fetch user roles');
    }
    throw error;
  }
};
