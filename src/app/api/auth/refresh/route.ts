import { refreshTokenServerAPI } from '@/lib/apis/server/auth-api'
import { proxyRoute } from '@/lib/proxy-route'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    return NextResponse.json(
      { message: 'No access token found' },
      { status: 401 },
    )
  }

  return proxyRoute(async () => {
    const data = await refreshTokenServerAPI(accessToken)
    return {
      message: 'Token refreshed successfully',
      data: { user: data.data.user },
    }
  })
}
