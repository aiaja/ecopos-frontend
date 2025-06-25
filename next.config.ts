import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tannn.my.id',
        port: '',
        pathname: '/storage/products/**',
      },
    ],
  },
};

export default nextConfig;
