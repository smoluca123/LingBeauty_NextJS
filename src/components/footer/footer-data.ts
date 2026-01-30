import { Facebook, Instagram, type LucideIcon } from 'lucide-react';
import { TikTokIcon } from './tiktok-icon';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const footerLinks: Record<string, FooterSection> = {
  about: {
    title: 'VỀ LING BEAUTY',
    links: [
      { label: 'Câu chuyện thương hiệu', href: '/about/brand-story' },
      { label: 'Về chúng tôi', href: '/about' },
      { label: 'Liên hệ', href: '/contact' },
    ],
  },
  policies: {
    title: 'CHÍNH SÁCH',
    links: [
      { label: 'Chính sách và quy định chung', href: '/policies/general' },
      {
        label: 'Chính sách và giao nhận thanh toán',
        href: '/policies/payment',
      },
      { label: 'Chính sách đổi sản phẩm', href: '/policies/exchange' },
      {
        label: 'Chính sách bảo mật thông tin cá nhân',
        href: '/policies/privacy',
      },
      { label: 'Điều khoản sử dụng', href: '/policies/terms' },
    ],
  },
  myAccount: {
    title: 'MY LING BEAUTY',
    links: [
      { label: 'Quyền lợi thành viên', href: '/account/benefits' },
      { label: 'Thông tin thành viên', href: '/account/profile' },
      { label: 'Theo dõi đơn hàng', href: '/account/orders' },
      { label: 'Hướng dẫn mua hàng online', href: '/help/how-to-buy' },
    ],
  },
  partners: {
    title: 'ĐỐI TÁC - LIÊN KẾT',
    links: [{ label: 'THE FACE SHOP Vietnam', href: '/partners/the-face-shop' }],
  },
};

export interface SocialLink {
  icon: LucideIcon;
  href: string;
  label: string;
}

export const socialLinks: SocialLink[] = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: TikTokIcon, href: 'https://tiktok.com', label: 'TikTok' },
];
