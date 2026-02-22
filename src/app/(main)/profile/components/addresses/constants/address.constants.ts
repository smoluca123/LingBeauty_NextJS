// ⚡ Performance Note: These barrel imports are automatically optimized by Next.js
// next.config.ts has optimizePackageImports: ['lucide-react'] configured
// At build time, Next.js transforms this to direct imports automatically
// Benefits: Clean code + 15-70% faster dev boot, 28% faster builds, 40% faster cold starts
import { Home, Building2, MapPin } from 'lucide-react';
import type { IAddressDataType } from '@/lib/types/interfaces/apis/address.interfaces';

// Address type labels mapping
export const ADDRESS_TYPE_LABELS: Record<IAddressDataType['type'], string> = {
  HOME: 'Nhà riêng',
  OFFICE: 'Văn phòng',
  OTHER: 'Khác',
} as const;

// Address type icons mapping
export const ADDRESS_TYPE_ICONS: Record<
  IAddressDataType['type'],
  React.ComponentType<{ className?: string }>
> = {
  HOME: Home,
  OFFICE: Building2,
  OTHER: MapPin,
} as const;
