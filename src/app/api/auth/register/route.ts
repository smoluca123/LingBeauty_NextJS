import { registerServerAPI } from '@/lib/apis/server/auth-api'
import { proxyRoute } from '@/lib/proxy-route'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  return proxyRoute(async () => {
    const { email, password, firstName, lastName, phone, username } =
      await request.json()
    const data = await registerServerAPI({
      email,
      password,
      firstName,
      lastName,
      phone,
      username,
    })
    return {
      message: data.message,
      data: { user: data.data.user },
    }
  })
}
