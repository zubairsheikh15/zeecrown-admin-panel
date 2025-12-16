/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'siltyntxitqkzjsngbcq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product_images/**',
      },
      {
        protocol: 'https',
        hostname: 'siltyntxitqkzjsngbcq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/banners/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Optimize for faster navigation
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-checkbox', '@radix-ui/react-label'],
  },
  // Enable compression
  compress: true,
};

export default nextConfig;
