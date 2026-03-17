import { BannersContent } from '@/app/admin/banners/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý Banner | Admin',
  description: 'Quản lý các banner trong hệ thống',
};

export default function BannersPage() {
  return <BannersContent />;
}
