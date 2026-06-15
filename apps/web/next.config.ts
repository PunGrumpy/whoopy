import type { NextConfig } from "next";

import "@/env";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
