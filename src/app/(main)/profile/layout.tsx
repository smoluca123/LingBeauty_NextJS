'use client';

import Link from 'next/link';
import { ProfileSidebar } from './components';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Trang chủ
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">Tài khoản</span>
      </nav>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <ProfileSidebar />

        {/* Content */}
        <main className="min-h-[400px]">{children}</main>
      </div>
    </div>
  );
}
