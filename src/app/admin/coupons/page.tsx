import { CouponsContent } from '@/app/admin/coupons/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Mã giảm giá | Admin',
  description: 'Quản lý các mã giảm giá trong hệ thống',
};

export default function CouponsPage() {
  return <CouponsContent />;
}
