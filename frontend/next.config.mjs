/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'cdn.builder.io'
    }]
  },
  webpack: (config) => {
    // Xử lý canvas
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    
    // Xử lý các module fallback
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      encoding: false,
      'pdfjs-dist': false,
    };

    // Bỏ qua các native addons
    config.module.noParse = [/node_modules\/canvas/];
    
    return config;
  }
};

export default withNextIntl(nextConfig);