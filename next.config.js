/** @type {import('next').NextConfig} */
// In dev (and on Vercel if you don't set NEXT_PUBLIC_API_BASE), calls to /api/*
// are proxied to the NestJS backend so the browser stays same-origin (no CORS).
const target = process.env.API_PROXY_TARGET || 'http://localhost:3000';

const nextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${target}/api/:path*` }];
  },
};

module.exports = nextConfig;
