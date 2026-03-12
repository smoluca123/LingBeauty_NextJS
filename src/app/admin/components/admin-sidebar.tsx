'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  Users,
  Store,
  Tag,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

// ============ Types ============
interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ============ Constants ============
const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Dashboard',
    items: [
      { icon: LayoutDashboard, label: 'Tổng quan', href: '/admin' },
    ],
  },
  {
    title: 'Sản phẩm',
    items: [
      { icon: Package, label: 'Tất cả sản phẩm', href: '/admin/products' },
      { icon: FolderTree, label: 'Danh mục', href: '/admin/categories' },
      { icon: Tag, label: 'Thương hiệu', href: '/admin/brands' },
      { icon: Warehouse, label: 'Kho hàng', href: '/admin/inventory' },
    ],
  },
  {
    title: 'Người dùng',
    items: [
      { icon: Users, label: 'Tất cả người dùng', href: '/admin/users' },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link 
                href="/admin" 
                onClick={() => isMobile && setOpenMobile(false)}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary-pink text-primary-foreground">
                  <LayoutDashboard className="size-4 text-white" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-primary-pink">Admin Panel</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarMenu className="px-2 py-1">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Về trang chủ"
            className="bg-primary-pink text-white hover:bg-primary-pink/90 hover:text-white"
          >
            <Link
              href="/"
              onClick={() => isMobile && setOpenMobile(false)}
            >
              <Store />
              <span>Về trang chủ</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarSeparator />
      <SidebarContent>
        {NAV_SECTIONS.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/admin' && pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className={
                          isActive
                            ? 'bg-primary-pink text-white hover:bg-primary-pink/90 hover:text-white'
                            : 'hover:bg-primary-pink/10 hover:text-primary-pink'
                        }
                      >
                        <Link 
                          href={item.href}
                          onClick={() => isMobile && setOpenMobile(false)}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}

