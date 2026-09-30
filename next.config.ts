import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 운영 서버 없이 정적 호스팅에 올리기 위해 전부 HTML로 내보낸다.
  output: "export",
  // static export에서는 Next의 이미지 최적화 서버를 쓸 수 없다.
  // 대신 scripts/extract-assets.mjs가 빌드 전에 webp로 리사이즈해 둔다.
  images: { unoptimized: true },
  // /company -> /company/index.html 로 떨어뜨려 일반 웹호스팅에서도 그대로 동작하게 한다.
  trailingSlash: true,
  // 개발 화면 왼쪽 아래에 뜨던 검은 원형 N 배지를 끈다. 개발 전용이라
  // 배포본과는 무관하고(내보낸 out/ 에는 애초에 흔적이 없다), 꺼도 컴파일·
  // 런타임 오류는 그대로 화면에 뜬다 — 사라지는 건 배지와 Devtools 패널
  // 진입점뿐이다. 끄지 않고 위치만 옮기려면 { position: "bottom-right" }.
  devIndicators: false,
};

export default nextConfig;
