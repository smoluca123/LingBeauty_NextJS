import { kyInstance } from '@/lib/kyInstance/ky';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  // Best-effort: call BE to invalidate the session, but don't fail if it errors
  try {
    await kyInstance.post('auth/logout');
  } catch {
    // Intentionally swallowed — cookie cleanup must always happen
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('userId');

  return NextResponse.json({ message: 'Logged out successfully' });
}
