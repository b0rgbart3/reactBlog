import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose', 'bcrypt', 'stripe'],
};

export default nextConfig;
