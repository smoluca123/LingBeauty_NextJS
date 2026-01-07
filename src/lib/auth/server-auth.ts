import { cookies } from 'next/headers';

/**
 * Get userId from cookie for server-side data fetching.
 * Use this in Server Components to fetch user-specific data (orders, comments, etc.)
 */
export async function getServerUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('userId')?.value ?? null;
}

/**
 * Get access token from cookie.
 * Use this for middleware or when you need to make authenticated API calls from server.
 */
export async function getServerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value ?? null;
}

/**
 * Check if user is authenticated on the server.
 * Use this in Server Components or middleware to check auth status.
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerAccessToken();
  return token !== null;
}
