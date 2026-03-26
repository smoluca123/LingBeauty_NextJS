import { logoutServerAPI } from '@/lib/apis/server/auth-api'
import { proxyRoute } from '@/lib/proxy-route'

export async function POST() {
  return proxyRoute(async () => {
    await logoutServerAPI()
    return { message: 'Logged out successfully' }
  })
}
