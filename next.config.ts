import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.blob.vercel-storage.com" },
      { protocol: "https", hostname: "mmbiz.qpic.cn" },
      { protocol: "https", hostname: "res.wx.qq.com" },
    ],
  },
};

export default nextConfig;
