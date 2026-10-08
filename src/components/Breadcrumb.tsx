import Link from "next/link";
import Container from "./Container";

/**
 * 헤더 바로 아래 놓는 현재 위치 표시.
 *
 * 전에는 배너 아래 회색 띠였는데, 배너와 따로 떠 보이고 48px 를 더 먹었다.
 * 헤더 바로 밑으로 올려 한 덩어리로 읽히게 했다.
 *
 * 따라 내려오게(sticky) 두지 않는다. 헤더(81px)와 합쳐 133px 를 늘 차지하는데,
 * 그 자리를 내주고 본문을 넓게 쓰는 쪽이 낫다.
 *
 * 바탕과 아래 테두리는 Header.tsx 가 쓰는 값 그대로다(bg-white/95
 * backdrop-blur + border-b border-line). 헤더와 한 덩어리로 보이게 하려는
 * 것이고, 아래 본문도 흰색이라 테두리가 없으면 띠가 사라진다.
 *
 * 글자 색은 눈대중이 아니라 흰 바탕 위 대비로 골랐다.
 *   muted      4.83:1  링크      (AA 4.5 를 넘는다)
 *   brand      5.09:1  링크 hover
 *   ink-soft   9.35:1  현재 항목
 *   muted/40   1.8:1   구분자 — aria-hidden 인 장식이라 기준 밖이다
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
    <div className="border-b border-line bg-white/95 backdrop-blur">
      <Container>
        <nav aria-label="현재 위치" className="py-4 text-13">
          <ol className="flex flex-wrap items-center gap-2">
            {trail.map((item) => (
              <li key={item.href} className="flex items-center gap-2">
                {/* ⚠️ px/py 로 누를 자리를 키우고 -mx/-my 로 되돌린다.
                       "홈" 은 한 글자라 실측 **12 x 19.5px** 였고, 이건
                       WCAG 2.5.8(AA)의 최소 24x24 에도 못 미친다. 음수
                       마진 덕에 **글자 위치와 간격은 1px 도 안 변하고**
                       누를 수 있는 면적만 24 x 27.5px 가 된다. */}
                <Link
                  href={item.href}
                  className="-mx-1.5 -my-1 inline-block px-1.5 py-1 text-muted transition-colors hover:text-brand"
                >
                  {item.label}
                </Link>
                <span aria-hidden="true" className="text-muted/40">
                  /
                </span>
              </li>
            ))}
            <li aria-current="page" className="font-medium text-ink-soft">
              {current}
            </li>
          </ol>
        </nav>
      </Container>
    </div>
  );
}
