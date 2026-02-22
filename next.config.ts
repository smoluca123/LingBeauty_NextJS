import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  /* config options here */
  reactCompiler: true,

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
