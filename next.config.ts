import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
