import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { NaverIcon, PhoneIcon, YoutubeIcon } from "./icons";
import { products } from "@/data/products";
import { site, telHref } from "@/data/site";

/**
 * 푸터 링크 묶음.
 *
 * nav(헤더 메뉴)를 그대로 쓰지 않는다. 헤더는 훑고 지나가는 곳이라 한 줄이지만
 * 푸터는 사이트 전체를 펼쳐 보이는 곳이라 분류가 달라진다 — 납품실적은 헤더에서
 * 최상위지만 여기서는 [회사]에 넣는다(거래처 목록은 회사를 보여 주는 자료다).
 *
 * 주제별로 나누면서 회사소개 아래 중첩 목록(조직도·보유 설비)이 없어졌다.
 * 한 열에 10행을 세로로 쌓던 것을 여러 열로 나눌 수 없었던 이유가 그 중첩이었다.
 */
const FOOTER_GROUPS: {
  title: string;
  /**
   * prefix 는 화면에서 감추고 글자에만 붙이는 앞말이다. 열 제목이 있어
   * 화면에서는 "개요" 로 족하지만, 검색엔진과 스크린리더는 링크 하나만
   * 떼어 읽는다. aria-label 로는 안 된다 — Lighthouse link-text 는
   * 보이는 글자를 보기 때문에 sr-only 로 글자 자체를 온전하게 만든다.
   * 뒤에 공백을 붙이지 않는다 — 공백은 sr-only 밖에서 넣는다(아래 참고).
   */
  links: { href: string; label: string; prefix?: string }[];
}[] =
  [
    {
      title: "회사",
      links: [
        // 열 제목이 이미 [회사]다. site.ts 의 드롭다운도 "개요" 라 표기가 맞는다.
        { href: "/company", label: "개요", prefix: "회사" },
        { href: "/company/vision", label: "조직도" },
        { href: "/company/facility", label: "보유 설비" },
        { href: "/clients", label: "납품실적" },
      ],
    },
    {
      title: "고객지원",
      links: [
        { href: "/videos", label: "영상자료" },
        { href: "/location", label: "오시는 길" },
        { href: "/contact", label: "문의하기" },
      ],
    },
  ];

/* muted 를 본문 크기 글자에 쓰면 이 배경에서 대비가 4.51:1 로 AA(4.5)를
   0.01 차로 넘는다. 여백이 없어 링크는 한 단계 진한 ink-soft 로 둔다.

   py-1 은 장식이 아니다 — 글자만 두면 누를 수 있는 높이가 20px 라
   WCAG 2.2 Target Size 기준(24px)에 못 미친다. 상하 4px 씩 붙여 28px 로
   만들고, 늘어난 만큼 목록의 gap 을 10px -> 2px 로 줄여 간격은 그대로
   보이게 한다. 글자 크기도 보이는 간격도 그대로고 손가락만 편해진다.

   세 열의 목록 링크 11개만 쓴다. 브랜드 열의 바깥 채널 링크는 한때 이 글자
   모양을 같이 썼지만 지금은 테두리 버튼이라 따로 간다(CHANNEL_BUTTON). */
const LINK =
  "inline-block py-1 text-sm text-ink-soft transition-colors hover:text-brand";

/* 브랜드 열의 외부 채널 버튼(유튜브·네이버). 테두리·배경·hover 는 /location
   의 외부 지도 링크 두 개와 같은 어휘다(location/page.tsx) — 거기도
   target="_blank" 외부 링크고, 같은 hover 를 ProductBrowser 도 쓴다.
     - bg-white 를 더했다. /location 은 흰 바탕 위라 배경이 필요 없지만
       푸터는 bg-surface 라 흰 바탕이라야 버튼이 떠 보인다.
     - p-2 정사각이다. 아이콘 16 + 패딩 16 + 테두리 2 = 34px 로, 글자가 있던
       시절 높이와 같다. 그래서 아래 정렬이 그대로 유지된다(전화번호 mt-3).

   ⚠ 글자가 없다. 그래서 두 링크의 접근성 이름은 전적으로 aria-label 이
     들고 있다 — 아이콘 <svg> 는 aria-hidden 이라 이름에 보태지 않는다.
     aria-label 을 지우면 스크린리더가 "링크" 라고만 읽고 Lighthouse
     link-name 도 깨진다. 글자를 되살리든 라벨을 두든, 둘 중 하나는 반드시
     있어야 한다. */
const CHANNEL_BUTTON =
  "flex items-center justify-center rounded border border-line bg-white p-2 text-ink-soft transition-colors hover:border-navy/40 hover:text-ink";

/* 자간 0.2em 은 Section.tsx 의 eyebrow 와 같은 값이다(푸터만 0.15em 이었다). */
const HEADING = "text-xs font-bold tracking-[0.2em] text-ink";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      {/* 헤더와 같은 wide 폭이다. 푸터도 사이트 크롬인데 content(1152) 를
          쓰고 있어 헤더 로고와 64px 어긋나 있었다. 하단 CTA 도 같이 넓혔다.

          위아래 패딩이 다르다(py-* 로 묶지 않는다). 위쪽은 본문과 푸터를
          떼어 놓는 일을 하지만 아래쪽은 페이지 끝이라 할 일이 없다.
          pb-8 이면 마지막 글자 밑동에서 34px — 참고한 ablelabsinc.com 의
          35px 과 같다. 묶어 뒀을 때는 66px 로 그 두 배였다. */}
      <Container width="wide" className="pb-8 pt-12 sm:pt-16">
        {/* lg 첫 열 폭은 로고가 정한다 — sm:h-8 에서 248px 라 좁으면 preflight 의
            img{max-width:100%} 에 눌린다. 기준은 lg 가 시작하는 1024px 다.
            거기서 여유가 1.7fr 37px / 1.6fr 26px / 1.5fr 14px 라 1.7fr 로 둔다. */}
        <div className="grid grid-cols-2 gap-10 sm:gap-x-12 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
          <div className="col-span-2 sm:col-span-1">
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={403}
              height={52}
              className="h-7 w-auto sm:h-8"
            />
            {/* 바깥 채널 두 개. 목록 링크가 아니라 테두리 버튼이다 — 옆 세
                열은 [제품]·[회사]·[고객지원] 제목 아래 묶여 있는데 이것만
                제목 없는 열에 혼자 서게 되어, 글자만 두면 어디에도 안 붙어
                보였다.

                유튜브는 /videos 안에만 있던 링크를 꺼냈다(영상이 회사를
                보여 주는 자료라 모든 페이지에서 닿는 편이 낫다). 네이버
                플레이스는 블로그 리뷰 27건이 달려 있어 바깥에서 본 평이
                된다 — 미등록 상태라는 단서는 site.ts 에 적어 뒀다.

                ■ 마크만 두고 글자는 뺐다. 위에 로고가, 아래에 전화번호가
                  글자로 서 있어 이 줄만 기호로 두면 셋이 또렷하게 나뉜다.
                  이름은 aria-label 이 맡는다(CHANNEL_BUTTON 주석 참고).
                  title 도 같이 단다 — 마크를 못 알아본 사람에게 풍선말이
                  길이 된다. 접근성 이름은 aria-label 이 이기므로 두 번
                  읽히지 않는다.

                ■ 마크 색 — 알아볼 수 있는 색으로 둔다.
                  유튜브는 사이트 브랜드 레드(#d5261e)가 원색과 같은 계열이라
                  그대로 쓴다. 팔레트도 지키고 알아보기도 한다.
                  네이버 초록(#03C75A)은 사이트에 가까운 색이 없어 제 색을
                  쓴다. 브랜드 레드로도 그려 봤는데 빨간 N 은 아무것도 뜻하지
                  않았다. 초록은 흰 바탕 대비 2.4:1 로 비문자 기준(3:1)에
                  못 미치지만, 아이콘은 aria-hidden 장식이고 링크 이름은
                  aria-label 이 따로 들고 있어 WCAG 1.4.11 대상이 아니다.

                ■ 폭 — 34px 버튼 둘에 간격 8px, 줄 폭 75px 다. 가장 좁은
                  열(640 에서 256px)에도 넉넉해 어느 폭에서도 한 줄이다.
                  글자가 있던 때는 270px 라 640~690 구간에서 두 줄로 내려가
                  이 열이 [제품] 열보다 41px 길어졌는데, 그 문제가 같이
                  없어졌다. */}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={site.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="유튜브 채널"
                title="유튜브 채널"
                className={CHANNEL_BUTTON}
              >
                <YoutubeIcon className="shrink-0 text-brand" />
              </a>
              <a
                href={site.naverPlace}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="네이버 플레이스"
                title="네이버 플레이스"
                className={CHANNEL_BUTTON}
              >
                <NaverIcon className="shrink-0 text-[#03C75A]" />
              </a>
            </div>

            {/* 대표번호는 푸터에서 가장 중요한 한 줄이다. 팩스·이메일은 맨
                아래 사업자정보 줄로 내렸다 — 성격이 다른 정보다.

                전에는 로고와 이 번호 사이에 "부품 자동정렬 공급기 설계 ·
                제작" 이 있었다. 로고 영문(FEEDING AUTOMATION SYSTEM)을
                한국어로 받아 주는 자리였는데, 같은 말이 홈 히어로·제품
                머리말·회사소개·검색 설명에 이미 있어 뺐다. 그때 이 열이 옆
                열보다 37px 일찍 끝났는데, 유튜브 링크가 들어오면서 다시 찼다.

                간격은 재서 골랐다. 32(로고) + 16 + 34(버튼) + 12 + 28 + 8 +
                20 = 150px 로, [제품] 열 마지막 행(우레탄 코팅·전체 보기)과
                오차 0px 다. 버튼이 글자 링크보다 6px 커진 만큼을 여기서 뺐다
                (mt-5 -> mt-3). 버튼은 테두리가 스스로 경계를 만들어 주므로
                간격이 좁아도 위에 붙어 보이지 않는다. */}
            <a
              href={telHref(site.tel)}
              className="mt-3 inline-flex items-center gap-2 text-lg font-bold tabular-nums text-ink transition-colors hover:text-brand"
            >
              <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
              {site.tel}
            </a>
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              {site.hours.weekday} · {site.hours.holiday}
            </p>
          </div>

          {/* 제품 상세는 헤더 드롭다운에만 있었는데 그건 클라이언트 컴포넌트라
              정적 HTML에 남지 않는다. 홈·제품 목록을 뺀 7개 페이지에서 제품
              상세로 가는 링크가 하나도 없었다. 여기서 펼쳐 모든 페이지에 건다. */}
          <div className="col-span-2 sm:col-span-1">
            <h2 className={HEADING}>제품</h2>
            {/* max-content 2열 — 1fr 2열로 두면 둘째 열이 칸 오른쪽 끝까지
                밀려 옆 [회사] 열에 붙어 보인다. */}
            <ul className="mt-4 grid grid-cols-[max-content_max-content] gap-x-8 gap-y-0.5">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link href={`/products/${product.slug}`} className={LINK}>
                    {product.name}
                  </Link>
                </li>
              ))}
              <li>
                {/* 화면에는 열 제목이 있어 "전체 보기" 로 족하지만, 링크만
                    떼어 읽는 쪽에는 "제품" 을 붙여 준다.
                    공백은 sr-only 밖에 둔다 — 안에 넣으면 복사할 때
                    "제품전체 보기" 로 붙는다. sr-only 는 absolute 라
                    흐름에서 빠지고, 남은 공백은 줄 첫머리가 되어 CSS 가
                    지운다(링크 폭 55px 그대로). */}
                <Link href="/products" className={LINK}>
                  <span className="sr-only">제품</span>{" "}
                  전체 보기
                </Link>
              </li>
            </ul>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className={HEADING}>{group.title}</h2>
              {/* space-y 와 grid gap 을 섞지 않는다 — grid 안에서는 margin 과
                  gap 이 둘 다 적용돼 간격이 두 배가 된다. */}
              <ul className="mt-4 grid gap-y-0.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={LINK}>
                      {link.prefix && (
                        <>
                          <span className="sr-only">{link.prefix}</span>{" "}
                        </>
                      )}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 사업자정보. 상호·대표·주소·연락처·사업자등록번호가 관례상 한자리에
            모인다. 팩스는 걸 수 없어 링크가 아니다(헤더·CTA·문의하기와 같은 규칙). */}
        <div className="mt-12 space-y-2 border-t border-line pt-6 text-xs leading-relaxed text-ink-soft">
          <p>
            <Link
              href="/location"
              className="transition-colors hover:text-brand"
            >
              {site.address.road}
            </Link>
            {" · 팩스 "}
            <span className="whitespace-nowrap tabular-nums">{site.fax}</span>
            {" · "}
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-brand"
            >
              {site.email}
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} {site.name} · 대표 {site.ceo} ·
            사업자등록번호{" "}
            <span className="whitespace-nowrap tabular-nums">{site.businessNumber}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
