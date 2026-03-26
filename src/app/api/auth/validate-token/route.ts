import { validateTokenServerAPI } from '@/lib/apis/server/auth-api'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const userId = cookieStore.get('userId')?.value

  if (!accessToken || !userId) {
    return NextResponse.json({ isAuthenticated: false, user: null })
  }

  const result = await validateTokenServerAPI(accessToken)
  return NextResponse.json(result)
}
