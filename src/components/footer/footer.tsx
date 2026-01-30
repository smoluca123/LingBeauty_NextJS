'use client';

import { FooterBrand } from './footer-brand';
import { FooterLinkSection } from './footer-link-section';
import { footerLinks } from './footer-data';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Social Section */}
          <FooterBrand />

          {/* Footer Link Sections */}
          <FooterLinkSection section={footerLinks.about} />
          <FooterLinkSection section={footerLinks.policies} />
          <FooterLinkSection section={footerLinks.myAccount} />
          <FooterLinkSection section={footerLinks.partners} />
        </div>
      </div>
    </footer>
  );
}
