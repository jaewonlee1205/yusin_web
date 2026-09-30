import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { PhoneIcon } from "./icons";
import { products } from "@/data/products";
import { site } from "@/data/site";

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
   */
  links: { href: string; label: string; prefix?: string }[];
}[] =
  [
    {
      title: "회사",
      links: [
        // 열 제목이 이미 [회사]다. site.ts 의 드롭다운도 "개요" 라 표기가 맞는다.
        { href: "/company", label: "개요", prefix: "회사 " },
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
   0.01 차로 넘는다. 여백이 없어 링크는 한 단계 진한 ink-soft 로 둔다. */
const LINK = "text-sm text-ink-soft transition-colors hover:text-brand";
const HEADING = "text-xs font-bold tracking-[0.15em] text-ink";

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
            {/* 로고 영문(FEEDING AUTOMATION SYSTEM) 을 한국어로 받아 주는 자리라
                문장이 아니라 명사구로 둔다. 제품 이름은 바로 옆 [제품] 열에 일곱
                개가 있고, 설립연도는 회사소개에 있어 여기서는 뺐다. */}
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              부품 자동정렬 공급기 설계 · 제작
            </p>

            {/* 대표번호는 푸터에서 가장 중요한 한 줄이라 브랜드 블록 바로 아래,
                시선이 처음 닿는 자리에 둔다. 팩스·이메일은 맨 아래 사업자정보
                줄로 내렸다 — 성격이 다른 정보다. */}
            <a
              href={`tel:${site.tel.replace(/-/g, "")}`}
              className="mt-6 inline-flex items-center gap-2 text-lg font-bold tabular-nums text-ink transition-colors hover:text-brand"
            >
              <PhoneIcon className="h-[18px] w-[18px] shrink-0" />
              {site.tel}
            </a>
            <p className="mt-2 text-xs leading-relaxed text-muted">
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
            <ul className="mt-4 grid grid-cols-[max-content_max-content] gap-x-8 gap-y-2.5">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link href={`/products/${product.slug}`} className={LINK}>
                    {product.name}
                  </Link>
                </li>
              ))}
              <li>
                {/* 화면에는 열 제목이 있어 "전체 보기" 로 족하지만, 링크만
                    떼어 읽는 쪽에는 "제품" 을 붙여 준다. */}
                <Link href="/products" className={LINK}>
                  <span className="sr-only">제품 </span>전체 보기
                </Link>
              </li>
            </ul>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className={HEADING}>{group.title}</h2>
              {/* space-y 와 grid gap 을 섞지 않는다 — grid 안에서는 margin 과
                  gap 이 둘 다 적용돼 간격이 두 배가 된다. */}
              <ul className="mt-4 grid gap-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={LINK}>
                      {link.prefix && (
                        <span className="sr-only">{link.prefix}</span>
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
        <div className="mt-12 space-y-2 border-t border-line pt-6 text-xs leading-relaxed text-muted">
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
