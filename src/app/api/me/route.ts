import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'
import { updateMyInformationAPI } from '@/lib/apis/server/actions/user-actions'
import { kyInstance } from '@/lib/kyInstance/ky'
import { proxyRoute } from '@/lib/proxy-route'
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces'
import { updateUserInfoSchema } from '@/lib/schemas/user.schema'
import type { z } from 'zod'

export const GET = () =>
  proxyRoute(() =>
    kyInstance.get('user/me').json<IApiResponseWrapperType<IUserDataType>>(),
  )

export const PATCH = async (request: Request) => {
  const body: z.infer<typeof updateUserInfoSchema> = await request.json()
  return proxyRoute(() => updateMyInformationAPI(body))
}
