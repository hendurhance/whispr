/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Turbopack ignores a stray lockfile in the home dir
  turbopack: {
    root: import.meta.dirname,
  },
  // Ensure the next/og font files are traced into serverless bundles
  outputFileTracingIncludes: {
    '/**': ['./app/og/fonts/**'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'react-hot-toast',
      'qrcode.react',
      '@supabase/ssr',
      '@supabase/supabase-js',
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
