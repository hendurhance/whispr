/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'react-hot-toast',
      'qrcode.react',
      '@supabase/ssr',
      '@supabase/supabase-js',
      'framer-motion',
    ],
    // Enable staleTimes for client-side router cache
    staleTimes: {
      dynamic: 30, // Cache dynamic pages for 30 seconds
      static: 180, // Cache static pages for 3 minutes
    },
  },
  // Compiler optimizations
  compiler: {
    removeConsole: false,
  },
  // Performance optimizations
  reactStrictMode: true,
}

export default nextConfig
