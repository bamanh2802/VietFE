/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false, // Enable if possible
  images: {
    domains: ['cdn.builder.io'],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false; // Ensure this is necessary
    return config;
  },
  // Removed `experimental.appDir` as it's unnecessary
};

export default withNextIntl(nextConfig);
