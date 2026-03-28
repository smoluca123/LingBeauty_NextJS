import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  /* config options here */
  reactCompiler: true,
  compiler: {
    // removeConsole: {
    //   exclude: ['error', 'warn'], // Keeps console.error and console.warn
    // },
  },

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
}

export default nextConfig
