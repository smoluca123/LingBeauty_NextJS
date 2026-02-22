'use client';

import { useAuthUser, useAuthLoading, useRefreshAuth } from '@/hooks/use-auth';
import AccountError from './error';
import AccountLoading from '@/app/(main)/profile/account/components/account-loading';
import { AccountForm } from '@/app/(main)/profile/account/components';

export default function AccountShield() {
  const user = useAuthUser();
  const isLoading = useAuthLoading();
  const refreshAuth = useRefreshAuth();

  if (isLoading) {
    return <AccountLoading />;
  }

  if (!user) {
    return <AccountError reset={refreshAuth} />;
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
