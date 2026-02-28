'use server';

import { kyInstance } from '@/lib/kyInstance/ky';
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

export const getMeApi = async () =>
  kyInstance.get('user/me').json<IApiResponseWrapperType<IUserDataType>>();
