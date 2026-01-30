import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/logo';
import { FooterSocialLinks } from './footer-social-links';

export function FooterBrand() {
  return (
    <div className="space-y-6">
      <Logo
        className="text-left"
        classNames={{
          container: 'text-left',
          text: 'text-xl',
        }}
      />

      {/* Social Links */}
      <FooterSocialLinks />

      {/* Verified Badge */}
      <Link
        href="http://online.gov.vn"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        <Image
          src="/assets/footer/verified.png"
          alt="Đã thông báo Bộ Công Thương"
          width={130}
          height={50}
          className="object-contain"
        />
      </Link>
    </div>
  );
}
