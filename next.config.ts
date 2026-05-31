import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://a.espncdn.com/i/teamlogos/**"),
      new URL("https://cdn.nba.com/headshots/**"),
    ],
  },
};

export default nextConfig;
