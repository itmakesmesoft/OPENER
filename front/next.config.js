/* eslint-disable @typescript-eslint/no-var-requires */

const { redirect } = require('next/dist/server/api-utils');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'opener-bucket.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:path*',
  //       destination: 'http://k8c104.p.ssafy.io:8000/:path*',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
