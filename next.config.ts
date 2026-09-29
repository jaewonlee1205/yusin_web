import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 운영 서버 없이 정적 호스팅에 올리기 위해 전부 HTML로 내보낸다.
  output: "export",
  // static export에서는 Next의 이미지 최적화 서버를 쓸 수 없다.
  // 대신 scripts/extract-assets.mjs가 빌드 전에 webp로 리사이즈해 둔다.
  images: { unoptimized: true },
  // /company -> /company/index.html 로 떨어뜨려 일반 웹호스팅에서도 그대로 동작하게 한다.
  trailingSlash: true,
};

export default nextConfig;
