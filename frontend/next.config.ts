import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external sources for avatars / placeholders
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
  // Proxy API calls in dev so no CORS issues
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
