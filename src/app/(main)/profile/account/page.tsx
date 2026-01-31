import { AccountForm } from '../components';
import { getMeApi } from '@/lib/apis/server/user-apis';

/**
 * Account page - Server Component
 * Fetches user data server-side and passes to AccountForm
 * Loading state: handled by loading.tsx
 * Error state: handled by error.tsx
 */
export default async function AccountPage() {
  // Fetch user data server-side
  const userData = await getMeApi();

  // Pass user data to client component
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Tài khoản</h1>
      <AccountForm user={userData.data} />
    </div>
  );
}
