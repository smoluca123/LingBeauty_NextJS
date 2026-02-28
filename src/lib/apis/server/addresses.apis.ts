import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants/api';
import { kyInstance } from '@/lib/kyInstance/ky';
import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';
import type {
  IApiPaginationParams,
  IApiPaginationResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces';

export const getMyAddressesAPI = async ({
  limit = DEFAULT_LIMIT,
  page = DEFAULT_PAGE,
  search,
}: IApiPaginationParams & { search?: string }): Promise<
  IApiPaginationResponseWrapperType<IAddressDataType>
> =>
  kyInstance
    .get('user/address', {
      searchParams: { limit, page, ...(search && { search }) },
    })
    .json<IApiPaginationResponseWrapperType<IAddressDataType>>();
