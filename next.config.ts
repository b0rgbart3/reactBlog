import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose', 'bcrypt', 'stripe'],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/uploads/:path*',
          destination: '/api/serve-file/:path*',
        },
      ],
      afterFiles: [
        {
          source: '/calculator',
          destination: '/calculator/index.html',
        },
        {
          source: '/calculator/:path*',
          destination: '/calculator/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
