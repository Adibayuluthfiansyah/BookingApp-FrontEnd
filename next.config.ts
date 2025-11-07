import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000, // Cek perubahan setiap 1 detik
      aggregateTimeout: 300, // Tunda build ulang selama 300ms
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
