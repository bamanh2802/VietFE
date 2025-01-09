/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["developers.elementor.com"],
  },
  serverExternalPackages: ['@react-pdf/renderer'],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    appDir: true,
  },
};

module.exports = withNextIntl(nextConfig);
