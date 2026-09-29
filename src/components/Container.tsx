import type { ReactNode } from "react";

/** 모든 페이지가 공유하는 가로 폭과 좌우 여백. 모바일에서도 최소 20px 거터를 준다. */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
