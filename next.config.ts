import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        "./scripts/seedValentinesFlashSale":
          "commonjs ./scripts/seedValentinesFlashSale",
      });
    }
    return config; // ← Important: return the config
  },
};

export default nextConfig;
