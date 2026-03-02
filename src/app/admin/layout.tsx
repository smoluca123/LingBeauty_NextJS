'use client';

import { AdminSidebar, AdminHeader, AdminGuard } from './components';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <SidebarProvider className="h-screen w-full overflow-hidden">
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}
