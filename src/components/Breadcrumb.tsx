import Link from "next/link";
import Container from "./Container";

/**
 * 헤더 바로 아래 네이비 띠에 놓는 현재 위치 표시.
 *
 * 전에는 배너 아래 회색 띠였는데, 배너와 따로 떠 보이고 48px 를 더 먹었다.
 * 네이비(헤더 아래 어두운 띠)로 올리면 헤더와 한 덩어리로 읽힌다.
 *
 * 색은 눈대중이 아니라 바탕(navy-deep #06265c) 위 대비로 골랐다.
 *   white/60  6.08:1  링크      (AA 4.5 를 넉넉히 넘는다)
 *   white/90 12.02:1  현재 항목
 *   white/30  2.17:1  구분자 — aria-hidden 인 장식이라 기준 밖이다
 */
export default function Breadcrumb({
  trail,
  current,
}: {
  /** 앞쪽 링크들. 예: [{ href: "/", label: "홈" }, …] */
  trail: { href: string; label: string }[];
  /** 지금 보고 있는 쪽. 링크가 아니다. */
  current: string;
}) {
  return (
    <div className="bg-navy-deep">
      <Container>
        <nav aria-label="현재 위치" className="py-4 text-[13px]">
          <ol className="flex flex-wrap items-center gap-2">
            {trail.map((item) => (
              <li key={item.href} className="flex items-center gap-2">
                <Link
                  href={item.href}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
                <span aria-hidden="true" className="text-white/30">
                  /
                </span>
              </li>
            ))}
            <li aria-current="page" className="font-medium text-white/90">
              {current}
            </li>
          </ol>
        </nav>
      </Container>
    </div>
  );
}
