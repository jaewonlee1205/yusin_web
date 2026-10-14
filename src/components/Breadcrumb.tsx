import Link from "next/link";
import Container from "./Container";

/**
 * 헤더 바로 아래 놓는 현재 위치 표시. 제품 상세 7쪽이 쓴다 — 그 페이지만
 * PageHero(배너)를 두지 않고 이것으로 대신한다.
 *
 * 전에는 배너 아래 회색 띠였는데, 배너와 따로 떠 보이고 48px 를 더 먹었다.
 * 헤더 바로 밑으로 올려 한 덩어리로 읽히게 했다.
 *
 * 따라 내려오게(sticky) 두지 않는다. 헤더(81px)와 합쳐 133px 를 늘 차지하는데,
 * 그 자리를 내주고 본문을 넓게 쓰는 쪽이 낫다.
 *
 * ⚠️⚠️ **2026-10-14 에 흰 띠에서 네이비로 뒤집었다.** "이쪽 색상 경우 흰색처럼
 *    보이는데 ... 문의 띠 여기 색상하고 동일하게 해주고 네이비 글자는 흰색으로"
 *    라는 말을 들었다. 같은 날 PageHero 도 함께 뒤집혀, 이제 **모든 페이지의
 *    상단이 네이비**다.
 *
 *    옛 값은 bg-white/95 backdrop-blur + border-line 이었고, "헤더가 쓰는 값
 *    그대로" 라는 것이 근거였다. 그 헤더가 네이비(dark-deep)가 되면서 전제가
 *    사라졌다. ⚠️ backdrop-blur 는 같이 걷었다 — sticky 가 아니라 뒤에 흐릴
 *    것이 없다. 아래 테두리는 남긴다. 본문이 흰색이라 선이 없어도 띠는
 *    보이지만, 헤더와 이 띠를 가르는 선(헤더의 border-b)과 짝이 맞아야 한다.
 *
 * ⚠️ **바탕은 dark(#0d1b33)지 dark-deep 이 아니다.** 헤더가 dark-deep 이고
 *    "견적 문의 여기보다는 덜 찐한 네이비" 라고 짚어 준 그 차이다.
 *
 * 글자 색은 눈대중이 아니라 네이비 바탕 위 대비로 골랐다. 계산이 아니라
 * **화면 픽셀을 뽑아 잰 값**이다(Tailwind v4 의 computed color 는 oklab 이라
 * 자동 측정이 어긋난다).
 *   white/70      8.9:1   링크       (AA 4.5 를 넘는다)
 *   brand-light   6.08:1  링크 hover (brand 는 3.38 이라 13px 글자에 모자란다)
 *   white        17.19:1  현재 항목
 *   white/30      —       구분자 — aria-hidden 인 장식이라 기준 밖이다
 * (옛 값 muted 4.83 · brand 5.09 · ink-soft 9.35 는 전부 흰 바탕 기준이다.)
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
    /* ⚠️ 장식을 넣지 말 것. PageHero 에는 동심원 파문이 있지만 여기는 높이가
          51px 뿐이고, "여기 경우는 배경 장식 없어도 될 거 같고" 라는 말을
          들은 자리다. */
    <div className="border-b border-white/10 bg-dark">
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
                  className="-mx-1.5 -my-1 inline-block px-1.5 py-1 text-white/70 transition-colors hover:text-brand-light"
                >
                  {item.label}
                </Link>
                <span aria-hidden="true" className="text-white/30">
                  /
                </span>
              </li>
            ))}
            <li aria-current="page" className="font-medium text-white">
              {current}
            </li>
          </ol>
        </nav>
      </Container>
    </div>
  );
}
