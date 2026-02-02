'use client';

import { AccountForm } from '@/app/(main)/profile/components';
import { useAuth } from '@/hooks/use-auth';
import AccountError from './error';
import AccountLoading from '@/app/(main)/profile/account/components/account-loading';

export default function AccountShield() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <AccountLoading />;
  }

  if (!user) {
    return <AccountError reset={() => {}} />;
  }

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Tài khoản</h1>
        <AccountForm user={user} />
      </div>
    </>
  );
}
