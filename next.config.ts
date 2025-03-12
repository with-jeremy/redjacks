import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  }
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rfrbjhtoimkuksskptwk.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
