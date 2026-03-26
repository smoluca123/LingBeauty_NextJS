import { loginServerAPI } from '@/lib/apis/server/auth-api'
import { proxyRoute } from '@/lib/proxy-route'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  return proxyRoute(async () => {
    const { email, password } = await request.json()
    const data = await loginServerAPI({ email, password })
    return {
      message: data.message,
      data: { user: data.data.user },
    }
  })
}
