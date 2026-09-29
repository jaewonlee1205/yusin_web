import type { ReactNode } from "react";

/**
 * 모든 페이지가 공유하는 가로 폭과 좌우 여백. 모바일에서도 최소 20px 거터를 준다.
 *
 * width
 *  - "content" (기본) : 본문용. 읽기 좋은 폭.
 *  - "wide"           : 헤더처럼 화면을 더 쓰는 사이트 크롬용.
 */
export default function Container({
  children,
  className = "",
  width = "content",
}: {
  children: ReactNode;
  className?: string;
  width?: "content" | "wide";
}) {
  const max = width === "wide" ? "max-w-7xl" : "max-w-6xl";

  return (
    <div className={`mx-auto w-full ${max} px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
