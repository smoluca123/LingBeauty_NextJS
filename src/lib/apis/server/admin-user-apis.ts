'use server';
import { kyInstance } from '@/lib/kyInstance/ky';
import {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';
import { IUserDataType, IUserRoleDataType } from '@/lib/types/interfaces/apis/user.interfaces';

export interface IAdminUserQueryParams extends IApiPaginationParams {
  search?: string;
  roleId?: string;
  isActive?: boolean;
  isBanned?: boolean;
  isVerified?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'email' | 'firstName' | 'lastName';
  order?: 'asc' | 'desc';
}

export const getAllUsersAdminAPI = async (
  options: IAdminUserQueryParams = { page: 1, limit: 10 },
): Promise<IApiPaginationResponseWrapperType<IUserDataType>> => {
  try {
    const searchParams: Record<string, string | number | boolean> = {};
    if (options.page) searchParams.page = options.page;
    if (options.limit) searchParams.limit = options.limit;
    if (options.search) searchParams.search = options.search;
    if (options.roleId) searchParams.roleId = options.roleId;
    if (options.isActive !== undefined) searchParams.isActive = options.isActive;
    if (options.isBanned !== undefined) searchParams.isBanned = options.isBanned;
    if (options.isVerified !== undefined) searchParams.isVerified = options.isVerified;
    if (options.sortBy) searchParams.sortBy = options.sortBy;
    if (options.order) searchParams.order = options.order;

    const data = await kyInstance
      .get('user', { searchParams })
      .json<IApiPaginationResponseWrapperType<IUserDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching users:', error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const getUserByIdAdminAPI = async (
  id: string,
): Promise<IApiResponseWrapperType<IUserDataType>> => {
  try {
    const data = await kyInstance
      .get(`user/${id}`)
      .json<IApiResponseWrapperType<IUserDataType>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching user by id:', error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};

export const getAllUserRolesAPI = async (): Promise<
  IApiResponseWrapperType<IUserRoleDataType[]>
> => {
  try {
    const data = await kyInstance
      .get('user/roles')
      .json<IApiResponseWrapperType<IUserRoleDataType[]>>();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching user roles:', error);
    if (error.response) {
      const errorData = await error.response.json();
      throw errorData.message;
    }
    throw error.message;
  }
};
