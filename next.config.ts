import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Add experimental features here if needed
  }
};

export default nextConfig;
