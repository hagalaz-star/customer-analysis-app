import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // ① 요청 본문 허용 용량을 원하는 크기로 지정
      //    숫자(바이트)나 '500kb', '10mb' 같은 문자열 모두 지원
      bodySizeLimit: "10mb",
    },
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
