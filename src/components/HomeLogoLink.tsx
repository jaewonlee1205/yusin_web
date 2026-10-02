"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { handleSameRouteClick } from "@/lib/scrollToTop";

/**
 * 로고를 감싸 홈으로 보내는 링크. 푸터가 쓴다.
 *
 * 푸터(Footer.tsx)는 서버 컴포넌트다. 모든 페이지에 들어가는 정적 덩어리라
 * 통째로 클라이언트로 돌리고 싶지 않아, usePathname 과 클릭 핸들러가 필요한
 * 이 한 조각만 떼어 냈다.
 *
 * 푸터는 거의 항상 바닥까지 내려와서 누르는 자리다. 홈에서 눌렀을 때 아무
 * 일도 안 일어나면 특히 이상해서, 헤더와 같은 "같은 경로면 맨 위로" 를 건다.
 */
export default function HomeLogoLink({
  className,
  label,
  children,
}: {
  className?: string;
  label: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      aria-label={label}
      onClick={(e) => handleSameRouteClick(e, pathname, "/")}
      className={className}
    >
      {children}
    </Link>
  );
}
