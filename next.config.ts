import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  experimental: {
    authInterrupts: true,
    staleTimes: {
      dynamic: 300,
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        // UploadThing CDN - For user uploaded images and files
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh',
      },
      {
        // Google User Content - For Google profile avatars
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // GitHub User Content - For GitHub profile avatars
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
