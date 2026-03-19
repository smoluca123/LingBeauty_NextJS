import { BannerGroupsContent } from '@/app/admin/banner-groups/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quản lý nhóm Banner | Admin',
  description: 'Quản lý nhóm banner',
};

export default function BannerGroupsPage() {
  return <BannerGroupsContent />;
}
