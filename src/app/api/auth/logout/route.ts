import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { kyInstance } from '@/lib/kyInstance/ky';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    // Call backend to invalidate token/session
    if (accessToken) {
      try {
        await kyInstance.post('auth/logout', {
          headers: { accessToken },
        });
      } catch {
        // Even if backend call fails, still clear cookies
      }
    }

    // Delete auth cookies
    cookieStore.delete('accessToken');
    cookieStore.delete('userId');

    return NextResponse.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    // Ensure cookies are always cleaned up
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('userId');

    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
