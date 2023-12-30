/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    URL_DB: process.env.URL_DB,
    NEXT_PUBLIC_APPENV: process.env.APPENV,
    NEXT_PUBLIC_BUILDID: process.env.BUILDID,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tif$/,
      use: {
        loader: "file-loader",
      },
    });
    return config;
  },
};

module.exports = nextConfig;
