/** @type {import('next').NextConfig} */
// If NEXT_PUBLIC_API_BASE_URL is empty, relative /api/* calls are proxied to
// the NestJS backend so the browser stays same-origin (no CORS).
const target = process.env.API_PROXY_TARGET || 'http://localhost:4000';

const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${target}/api/:path*` }];
  },
};

module.exports = nextConfig;
