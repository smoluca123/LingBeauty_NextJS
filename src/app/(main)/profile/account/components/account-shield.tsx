'use client';

import { useAuthUser, useAuthLoading, useRefreshAuth } from '@/hooks/use-auth';
import AccountError from './error';
import AccountLoading from '@/app/(main)/profile/account/components/account-loading';
import { AccountForm } from '@/app/(main)/profile/account/components';
import { AvatarSection } from './avatar-section';

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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Tài khoản</h1>

      {/* Avatar Section */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
        <AvatarSection user={user} />
        <div>
          <p className="text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Nhấp vào ảnh để thay đổi ảnh đại diện
          </p>
        </div>
      </div>

      {/* Account Form */}
      <AccountForm user={user} />
    </div>
  );
}
