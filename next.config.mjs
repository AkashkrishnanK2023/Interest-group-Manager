/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Helps with hydration issues
    esmExternals: 'loose'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [], // Add any external image domains here if needed
  },
  // Suppress hydration warnings in development
  reactStrictMode: true,
  swcMinify: true,
  // Add this to help with hydration
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Vercel-specific optimizations
  output: 'standalone',
  // Handle API routes properly
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

export default nextConfig
