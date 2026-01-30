import Link from 'next/link';
import { socialLinks } from './footer-data';

export function FooterSocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((social) => (
        <Link
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label={social.label}
        >
          <social.icon className="w-5 h-5" />
        </Link>
      ))}
    </div>
  );
}
