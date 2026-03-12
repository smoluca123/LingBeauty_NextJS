'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import UserAvatar from '@/components/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// ============ Types ============
interface BreadcrumbData {
  label: string;
  href?: string;
}

// ============ Helpers ============
function generateBreadcrumbs(pathname: string): BreadcrumbData[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbData[] = [];

  const labelMap: Record<string, string> = {
    admin: 'Admin',
    products: 'Sản phẩm',
    categories: 'Danh mục',
    brands: 'Thương hiệu',
    inventory: 'Kho hàng',
    users: 'Người dùng',
    new: 'Thêm mới',
  };

  segments.forEach((segment, index) => {
    const href =
      index < segments.length - 1
        ? '/' + segments.slice(0, index + 1).join('/')
        : undefined;

    breadcrumbs.push({
      label: labelMap[segment] || segment,
      href,
    });
  });

  return breadcrumbs;
}





// ============ Component ============
export function AdminHeader() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-3">
        {/* Sidebar Trigger */}
        <SidebarTrigger className="-ml-1" />

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm…"
            className="w-64 pl-8"
            aria-label="Tìm kiếm"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Thông báo (3 mới)">
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground" aria-hidden="true">
            3
          </span>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" aria-label="Cài đặt">
          <Settings className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="Menu người dùng">
              <UserAvatar />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Hồ sơ cá nhân</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin">Cài đặt</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
