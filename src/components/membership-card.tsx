'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Barcode from 'react-barcode';
import { User } from 'lucide-react';
import type { IUserDataType } from '@/lib/types/interfaces/apis/user.interfaces';

// ============ Types ============
export type MembershipTier = 'BRONZE' | 'SILVER' | 'GOLD';

interface MembershipCardProps {
  user: IUserDataType | null;
  tier?: MembershipTier;
  points?: number;
  pointsToNextTier?: number;
}

// ============ Constants ============
const TIER_CONFIG: Record<
  MembershipTier,
  { label: string; gradient: string; nextTier: string }
> = {
  BRONZE: {
    label: 'BRONZE',
    gradient: 'from-amber-600 via-amber-500 to-yellow-400',
    nextTier: 'SILVER',
  },
  SILVER: {
    label: 'SILVER',
    gradient: 'from-gray-400 via-gray-300 to-gray-200',
    nextTier: 'GOLD',
  },
  GOLD: {
    label: 'GOLD',
    gradient: 'from-yellow-500 via-yellow-400 to-amber-300',
    nextTier: '',
  },
};

// ============ Component ============
export function MembershipCard({
  user,
  tier = 'BRONZE',
  points = 0,
  pointsToNextTier = 100,
}: MembershipCardProps) {
  const barcodeRef = useRef<HTMLDivElement>(null);

  const tierConfig = TIER_CONFIG[tier];
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Guest';
  const phoneNumber = user?.phone || '0000000000';

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* User Info + Barcode */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {user?.avatarMedia?.url ? (
            <Image
              src={user.avatarMedia.url}
              alt={displayName}
              fill
              sizes="48px"
              className="rounded-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        {/* Name + Barcode */}
        <div className="flex-1">
          <p className="font-semibold text-foreground">{displayName}</p>
          <div ref={barcodeRef} className="mt-1">
            <Barcode
              value={phoneNumber}
              width={1.2}
              height={40}
              fontSize={12}
              displayValue={false}
              background="transparent"
              lineColor="currentColor"
            />
          </div>
        </div>
      </div>

      {/* Phone + Points */}
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <span>SĐT tích điểm</span>
        <span className="font-medium text-foreground">{phoneNumber}</span>
      </div>

      {/* Membership Tier Card */}
      <div
        className={`mt-4 rounded-lg bg-linear-to-r ${tierConfig.gradient} p-4 text-white shadow-md`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{tierConfig.label}</span>
            <span className="text-sm opacity-90">|</span>
            <span className="text-sm">{points} HSVPoint</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-xs font-bold">✨</span>
          </div>
        </div>

        {tierConfig.nextTier && (
          <p className="mt-2 text-sm opacity-90">
            Nhận thêm <strong>{pointsToNextTier} điểm</strong> nữa để nâng hạng
            lên <strong>{tierConfig.nextTier}</strong>
          </p>
        )}

        <button className="mt-3 flex items-center gap-1 text-sm font-medium hover:underline">
          Xem tất cả quyền lợi
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
