import Link from 'next/link';
import type { FooterSection } from './footer-data';

interface FooterLinkSectionProps {
  section: FooterSection;
}

export function FooterLinkSection({ section }: FooterLinkSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-sm text-muted-foreground mb-4">
        {section.title}
      </h3>
      <ul className="space-y-3">
        {section.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-foreground/80 hover:text-primary-pink transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
