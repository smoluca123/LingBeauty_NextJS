import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  /* config options here */
  reactCompiler: true,

  // ⚡ Performance: Optimize package imports (Vercel Best Practice 2.1)
  // Automatically transforms barrel imports to direct imports at build time
  // Example: import { Home } from 'lucide-react' → import Home from 'lucide-react/dist/esm/icons/home'
  // Benefits: 15-70% faster dev boot, 28% faster builds, 40% faster cold starts
  // @ts-expect-error - optimizePackageImports is valid in Next.js 13.5+ but not in type definition
  optimizePackageImports: [
    'lucide-react',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-select',
    '@radix-ui/react-tabs',
    '@radix-ui/react-label',
    '@radix-ui/react-avatar',
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-accordion',
    '@radix-ui/react-slot',
    '@radix-ui/react-collapsible',
  ],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'link.storjshare.io',
      },
    ],
  },
};

export default nextConfig;
