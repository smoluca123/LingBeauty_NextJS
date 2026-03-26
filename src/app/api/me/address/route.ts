import { addMyAddressAPI } from '@/lib/apis/server/actions/addresses.actions'
import { getMyAddressesAPI } from '@/lib/apis/server/addresses.apis'
import { proxyRoute } from '@/lib/proxy-route'
import type { AddressFormValues } from '@/lib/types/forms'

export const GET = (request: Request) => {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
  const page = searchParams.get('page')
  const search = searchParams.get('search')
  return proxyRoute(() =>
    getMyAddressesAPI({
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      search: search ?? undefined,
    }),
  )
}

export const POST = async (request: Request) => {
  const body: AddressFormValues = await request.json()
  return proxyRoute(() => addMyAddressAPI(body))
}
