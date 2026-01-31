'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MembershipCard } from '@/components/membership-card';
import { useAuth } from '@/hooks/use-auth';

// ============ Types ============
interface NavItem {
  label: string;
  href: string;
}

// ============ Constants ============
const NAV_ITEMS: NavItem[] = [
  { label: 'Tài khoản', href: '/profile/account' },
  { label: 'Đơn hàng', href: '/profile/orders' },
  { label: 'Địa chỉ giao nhận', href: '/profile/addresses' },
  { label: 'Ưu đãi của tôi', href: '/profile/offers' },
  { label: 'Câu hỏi của tôi', href: '/profile/questions' },
  { label: 'Sự kiện của tôi', href: '/profile/events' },
];

// ============ Component ============
export function ProfileSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-full space-y-6">
      {/* Membership Card */}
      <MembershipCard
        user={user}
        tier="BRONZE"
        points={0}
        pointsToNextTier={100}
      />

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'text-foreground border-l-2 border-primary-pink'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
