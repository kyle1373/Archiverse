/** @type {import('next').NextConfig} */
const nextConfig = {
  amp: true,
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    scrollRestoration: true,
    instrumentationHook: true,
  },
};

export default nextConfig;
