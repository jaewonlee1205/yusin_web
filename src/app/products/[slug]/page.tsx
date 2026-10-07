import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductGallery from "@/components/ProductGallery";
import ProductVideo from "@/components/ProductVideo";
import ApplicationCases from "@/components/ApplicationCases";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import {
  getProduct,
  products,
  type ApplicationCase,
  type Product,
} from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  // 검색 설명은 summary 가 아니라 lead 에서 가져온다. summary 는 히어로 한 줄
  // 요약이라 30자 안팎이고, 검색 결과 설명으로는 너무 짧다. lead 는 90~110자라
  // 그 자리에 알맞다.
  return {
    title: `${product.name} (${product.nameEn})`,
    description: product.lead,
    openGraph: {
      title: `${product.name} | 유신 F.A 시스템`,
      description: product.lead,
      images: [{ url: product.images[0].src }],
    },
  };
}

/**
 * 제품 상세.
 *
 * 이 페이지만 PageHero(네이비 배너)를 쓰지 않는다. 배너를 두면 제품명이
 * 배너 h1 · 빵부스러기 · 본문 h2 로 세 번 나오고, 머리에만 288px 를 쓴다.
 * 목록 페이지(제품·회사소개·납품실적 등 8개)는 배너를 그대로 쓴다 — 거기는
 * "무엇을 모아 둔 곳인지" 를 말해야 하지만, 상세는 제품 하나를 파는 자리라
 * 사진과 문의 버튼이 먼저 와야 한다.
 */
export default async function ProductDetailPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  // 아래 "다른 제품" 에 띄울 목록. 제품마다 개수가 다르다 — 지금 2~3개다.
  //
  // 전에는 목록을 돌려 가며 셋씩 뽑았다(products[(here + 1..3) % 7]). 일곱
  // 제품이 정확히 3회씩 나와 분포는 고르지만, 칸을 채우려고 관련 없는 제품도
  // 끌어왔다 — 우레탄 코팅 아래에 방음커버가 놓이는 식이다. 이제 products.ts
  // 의 related 를 그대로 읽는다. 근거는 각 제품 specs 에 적힌 연결 관계다.
  //
  // 그래도 한 번도 안 나오는 제품은 없다. 18칸의 등장 횟수는 볼피더 6 ·
  // 직진피더 4 · 컨트롤러 3 · 호퍼피더 2 · 진동기 1 · 방음커버 1 · 우레탄
  // 코팅 1 이다. 볼피더가 여섯인 것은 나머지 여섯이 전부 볼피더에 붙는
  // 물건이기 때문이라 숨길 일이 아니다(전에 고치려던 문제는 세 제품이 21칸
  // 중 0회였던 것이다).
  //
  // slug 오타는 products.ts 끝의 검사가 빌드 때 잡는다. 여기서는 타입을
  // 좁히려고 걸러 낸다.
  const related = product.related
    .map((slug) => getProduct(slug))
    .filter((p): p is Product => p !== undefined);

  return (
    <>
      <Breadcrumb
        trail={[
          { href: "/", label: "홈" },
          { href: "/products/", label: "제품" },
        ]}
        current={product.name}
      />

      {/* 제품 히어로 — 사진과 "무엇인지", 그리고 문의 버튼까지 첫 화면에 */}
      <div className="py-12 sm:py-16">
        <Container>
          {/* 오른쪽 칸을 왼쪽 사진에 줄 맞춘다.

              lg:items-start 를 빼 오른쪽 칸이 왼쪽 높이까지 늘어나게 하고,
              아래 사양 표 블록에 lg:mt-auto 를 줘 표와 버튼을 한 덩어리로
              바닥에 붙인다. 그러면 1280 이상에서 표 바닥이 큰 사진 바닥과,
              버튼 바닥이 썸네일 줄 바닥과 같은 선에서 끝난다.

              왼쪽 높이는 두 가지다 — 사진이 여러 장이면 468px(사진 384 +
              간격 12 + 썸네일 72), 한 장이면 썸네일 줄이 없어 384px 다
              (ProductGallery 참고). 사진이 한 장인 셋(진동기.호퍼피더.
              컨트롤러)은 오른쪽 칸이 438.6px 로 왼쪽보다 길어 mt-auto 가 0 이
              된다 — 맞출 상대가 없으니 그대로 흐른다.

              lg 미만은 한 칸으로 쌓이므로 flex 도 auto 마진도 일을 하지 않는다. */}
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <ProductGallery images={product.images} />

            <div className="lg:flex lg:flex-col">
              {/* 분류 배지(왼쪽)와 YUSIN 워드마크(오른쪽)가 한 줄이다.

                  ⚠️ 마크를 세 번 옮겼다 — 배지 줄 24px -> 제목 줄 32px ->
                     다시 배지 줄 32px. 문제는 **자리가 아니라 크기**였다.
                     24px 짜리가 70% 농도로 흐릿해, 배지와 양 끝에 설 무게가
                     없으니 그 사이 251~499px 가 "뭔가 더 있어야 할 빈 곳" 으로
                     보였다. 32px · 75% 면 93x30px 배지와 덩어리가 맞아 양 끝이
                     균형을 이룬다. **다시 24px 로 줄이지 말 것.**

                  ⚠️ self-start 를 주지 않는다. 그 값은 이 줄이 flex 행이
                     아니던 시절, 배지가 lg:flex-col 의 교차축 stretch 로 칸
                     폭(512px)까지 늘어나는 것을 막던 것이다. 지금은 부모가
                     flex **행**이라 stretch 축이 세로로 바뀌어 가로가 늘지
                     않고, 오히려 self-start 를 두면 items-center 를 이겨
                     배지가 마크와 세로 중앙이 안 맞는다.
                     (줄을 다시 쪼개면 그때는 self-start 가 필요하다)

                  ⚠️ 세로가 거의 늘지 않는다. 이 줄이 배지 30px -> 마크 32px 로
                     2px 자라지만, 1280.1440 에서는 사양 표의 lg:mt-auto 가 그
                     2px 를 흡수해 **표 바닥도 버튼 바닥도 변화 0** 이다.
                     1024 에서는 표와 사진이 **함께** 2.4px 밀려 둘의 관계
                     (-84.1px)가 그대로다. 재서 확인했다. 아래 버튼의 mt-7 은
                     "표 바닥 383.9 vs 사진 바닥 384" 를 0.1px 정밀도로 맞춘
                     값이니, 마크를 더 키우려거든 이 셈을 먼저 다시 하라.

                  ⚠️ 32px 가 상한이다. 이 파일은 손상된 PPT 래스터에서 잘라낸
                     129x32 라 그보다 키우면 뭉갠다 — h-8 은 원본 크기 그대로라
                     확대가 0 이다(h-6 은 오히려 0.75배 축소였다).
                     README 자료 요청 5번: 벡터 원본을 받으면 다시 뽑는다.

                  ⚠️ 제품명(h1) 안에 넣지 말 것. company/page.tsx 가 "사이트에서
                     글 안에 이미지를 넣는 유일한 자리 … 다른 제목으로 번지지
                     않게 한다 — 번지면 한글 표기 규칙이 무너진다" 고 적어 두었다.
                     여기는 글이 아니라 배지 옆 별도 요소라 그 금지에 걸리지 않는다.

                  워드마크만 쓴다. 전체 로고는 같은 화면 헤더에 이미 서 있어,
                  바로 아래 또 놓으면 같은 것을 두 번 읽는다.

                  alt 를 비운다. 헤더 로고가 이미 회사명을 읽어 주므로 여기서
                  또 읽으면 중복이고, 이 자리에서 뜻을 나르는 것은 옆의 분류
                  배지와 아래 제품명이다. */}
              <div className="flex items-center justify-between gap-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-bold tracking-[0.1em] text-ink-soft">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-brand"
                  />
                  {product.category}
                </p>
                <Image
                  src="/images/logo-mark.png"
                  alt=""
                  width={129}
                  height={32}
                  className="h-8 w-auto shrink-0 opacity-75"
                />
              </div>

              {/* 배너가 없으므로 제품명이 h1 이다. 검색에도 이쪽이 맞다. */}
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.08em] text-muted">
                {product.nameEn}
              </p>

              <p className="mt-6 text-lg font-medium leading-relaxed text-ink">
                {product.summary}
              </p>

              {/* 히어로 사양 표 — specs 앞 세 줄이다. 아래 사양 표는 slice(3)
                  로 뒤 세 줄만 쓴다. 같은 줄이 두 번 나오지 않는다.

                  "주요 사양" 라벨은 두지 않는다. 표가 아래 "제작 사양" 과 같은
                  짜임(격자선 + 회색 라벨 칸)이 되면서 그 자체로 사양표로 읽혀,
                  라벨은 같은 말을 한 번 더 하는 16px + 간격 12px 였다.

                  전에는 이 자리에 features.title 을 넣었는데, 아래 FEATURES
                  섹션의 제목 네 개와 글자까지 100% 같았다. 히어로는 "이 제품이
                  무엇인가"(주요 내용)를, 아래는 "왜 좋은가"(특징)를 맡아야
                  하므로 축을 사양으로 바꿨다.

                  그 전에는 lead 문단(3줄)이었다. lead 는 데이터에 남아
                  generateMetadata 의 검색 설명으로 쓰인다 — 화면에서만 빠졌다.

                  참고로 받은 신창에프에이 LSP 호퍼피더의 히어로 박스를 쟀다 —
                  568x208 에 라벨 + 특징 네 줄이었다. 우리는 그 자리를 사양으로
                  채우고 라벨 없이 표만 둔다.

                  값은 어느 폭에서나 한 줄이다. 13px 로 재면 앞 세 줄 21개의
                  가장 긴 것이 246px("스테인리스, 알루미늄 (부품 특성에 따라
                  선정)")이고, 값 칸이 가장 좁아지는 1024(308px)에도 들어간다.
                  라벨은 가장 긴 것이 63px("거칠기 등급")라 5rem(80px)에 든다.

                  dt/dd 는 dl 직계여야 한다(접근성 검사 dlitem). 묶는 div 대신
                  Fragment 를 쓴다 — 아래 사양 표와 같은 이유다. */}
              <div className="mt-6 lg:mt-auto">
                {/* 홈 "부품 자동정렬 공급기" 섹션의 박스 셋과 같은 언어다 —
                    bg-surface 박스 + 레드 점 + 굵은 라벨. 히어로가 흰 바탕이라
                    회색 박스가 또렷하다.

                    한때 아래 "제작 사양" 표와 같은 격자 표였다(gap-px +
                    bg-line 격자선, dt bg-surface / dd bg-white). 사양이 세
                    줄뿐인 자리에 표의 틀까지 두니 무거웠다. 아래 표는 값이
                    21개라 격자가 맞고, 여기는 박스 셋이 맞다.

                    dl/dt/dd 와 Fragment 는 그대로다 — 사양은 "용어-정의" 이고,
                    dt.dd 는 dl 직계여야 접근성 검사(dlitem)를 통과한다. 한 행이
                    하나의 박스로 보이게 dt 가 왼쪽 모서리를, dd 가 오른쪽
                    모서리를 나눠 가진다.

                    ⚠️ 값 셋은 1024 이상에서 모두 한 줄이다(가장 긴 것이
                       "스테인리스, 알루미늄 (부품 특성에 따라 선정)"). 라벨이
                       같은 줄에 서면서 값 칸이 그만큼 좁아지므로, 사양 글을
                       늘릴 때 1024 에서 다시 재야 한다.

                    높이는 198px 다(행 47 x 4 + 간격 8 x 3). 이 칸이
                    lg:mt-auto 로 아래 정렬이라, 행이 늘어도 1280 이상에서는
                    표 바닥과 갤러리 사진 바닥의 줄 맞춤이 그대로다(어긋남 0).

                    ⚠️ 1024 에서만 표가 갤러리보다 길어진다(세 줄일 때 12px,
                       네 줄이면 64px). 그 폭은 두 칸이 좁아 원래도 어긋나 있던
                       자리다. */}
                <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-y-2">
                  {product.specs.slice(0, 4).map((spec) => (
                    <Fragment key={spec.label}>
                      <dt className="flex items-center gap-2.5 whitespace-nowrap rounded-l-xl bg-surface py-3 pl-4 pr-2 text-[13px] font-bold text-ink">
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                        />
                        {spec.label}
                      </dt>
                      <dd className="flex items-center rounded-r-xl bg-surface py-3 pr-4 text-[13px] leading-snug text-ink-soft">
                        {spec.value}
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </div>

              {/* 버튼 둘. 보던 제품이 아니면 목록으로 돌아갈 길을 같이 둔다.

                  둘 다 sm:flex-1 로 반반이다(각 250px). 전에는 둘 다 내용
                  크기라 줄이 362px 에서 끝나 오른쪽 150px 가 비었고, 그래서 첫
                  버튼에만 flex-1 을 줬더니 375 / 125px 로 한쪽이 과하게 커졌다.
                  반반이어도 줄은 그대로 끝까지 차고, CTA 위계는 크기가 아니라
                  색이 맡는다 — 채운 빨강 vs 테두리만 있는 네이비.
                  640 미만은 flex-col 이라 이미 전폭이다.

                  위 간격이 32 가 아니라 28px(mt-7)인 이유는 줄 맞춤이다. 칸
                  바닥이 468, 버튼이 56.1px 이므로 28px 를 두면 표 바닥이
                  468 - 56.1 - 28 = 383.9 로 떨어져 큰 사진 바닥(384)과 0.1px
                  차이가 된다. 32px 면 379.9 로 4px 어긋난다. */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact/"
                  className="rounded-xl bg-brand px-8 py-4 text-center text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:flex-1"
                >
                  {product.name} 견적 문의
                </Link>
                <Link
                  href="/products/"
                  className="rounded-xl border border-navy/30 px-8 py-4 text-center text-[15px] font-semibold text-navy transition-colors hover:border-navy hover:bg-surface sm:flex-1"
                >
                  제품 목록
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 특징 — 전에는 오른쪽 512px 칸에 갇힌 세로 목록이었다. 전폭으로 풀면
          한눈에 견준다. 왼쪽 2px 빨간 띠는 뺐다(분류 사이드바에서 걷어낸 것과
          같은 장식이고, 한 화면에 빨강이 여러 번 반복됐다).

          개수는 제품마다 다르다 — 2~4개다. products.ts 의 features 주석에
          기준을 적어 뒀다(사양 표에 같은 내용이 있으면 특징에 적지 않는다). */}
      {/* 제목만 가운데로 둔다. 참고한 안산FA 도 .section-title 이
          text-align:center 이고 항목은 왼쪽이다. align="center" 는 eyebrow 를
          알약 배지로도 바꾼다(Section 주석 참고). 사양·다른 제품 섹션은 왼쪽
          그대로다 — 한 섹션만 가운데면 그 섹션이 강조된다. */}
      <Section
        tone="surface"
        size="compact"
        eyebrow="FEATURES"
        title="제품 특징"
        align="center"
      >
        {/* 참고로 주신 ansanfa.com/sub03.html 의 "ANSANFA PRODUCT" 여섯 항목을
            재서 옮겼다.

              .row 1187x417 flex wrap   항목 6개가 3열 x 2행
              항목 396x149  배경.테두리.구분선 없음, 아래 여백 60px
              [0] div.icon      36x42 @x12 y0  체크 글리프 36px rgb(66,139,202)
              [1] h4.title     312x22 @x72 y0  18px/21.6px w700
              [2] p.description 312x48 @x72 y37 14px/24px w400 (2줄)

            거기서 가져온 것은 셋이다 — 마커가 번호가 아니라 체크라는 것,
            구분선이 없고 간격만으로 나눈다는 것, 아이콘과 글 사이를 넉넉히
            둔다는 것.

            전에는 번호 "01"~"04" 였다. 특징은 순서가 뜻을 갖지 않는다 —
            "이런 것을 합니다" 라 체크가 맞다.

            구분선을 걷었다. 2열에서 항목마다 border-b 를 주면 선이 gap-x-10
            에서 끊겨 ul 상단의 전폭 선과 길이가 어긋났는데, 그 문제도 같이
            사라진다. 대신 gap-y-8(32px)이 행을 나눈다(안산FA 는 60px 인데
            우리 글자가 작아 32px 로 맞췄다).

            아이콘은 20px 다. 안산FA 는 제목 18px 에 아이콘 36px(두 배)인데
            그 비율이면 34px 체크가 되어 레드가 너무 넓어진다(globals.css 토큰
            주석 — "레드는 면적을 좁게"). 20px 이면 제목의 1.2배이고 획이 얇아
            면적이 작다. 원형 배경은 두지 않는다 — 선을 걷은 자리에 또 도형을
            넣으면 가벼움이 사라진다. mt-0.5 는 20px 아이콘과 23.4px 제목 줄의
            시각 중심을 맞추는 값이다.

            열은 둘이다. 안산FA 는 여섯 개라 3열이 딱 맞지만 우리는 네
            개여서 3열이면 3+1 로 어긋난다. 2열이면 칸이 556px(1024 는 453px)
            라 제목 한 줄 + 항목 둘이 칸을 채운다.

            ⚠️ 흰 카드를 씌운 것은 나중의 판단이다. 안산FA 를 따라 배경도 선도
               없이 간격만으로 나눴는데, 회색 섹션 위에 맨 글자 네 덩어리가
               떠 있으니 글자만 있는 칸으로 읽혔다. 회색 바탕 위에서는 흰 카드가
               또렷하다(흰 섹션 위라면 약했을 것이다 — 홈 PROCESS 가 그 경우다).

               카드가 경계를 맡으므로 행 간격도 32px 에서 24px 로 줄였다. 선 없는
               글 덩어리를 떼어 놓으려고 넓게 뒀던 값이다.

            아이콘은 aria-hidden 이다. 목록이라는 사실은 ul/li 가 전달한다. */}
        <ul className="grid gap-6 lg:grid-cols-2">
          {product.features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 70} className="h-full">
              <div className="grid h-full grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 rounded-2xl bg-white p-6 shadow-card">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-brand"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <div>
                  <p className="text-[17px] font-bold leading-snug text-ink">
                    {f.title}
                  </p>
                  {/* 점 목록 둘. 한때 두 문장이 이어 붙은 한 덩어리였는데,
                      두 줄로 꽉 찬 글상자라 어디서 끊어 읽을지가 안 보였다.
                      홈 PROCESS 카드의 points 목록과 같은 꼴이다.

                      점은 4px(h-1 w-1)다 — 카드 **안의** 하위 항목에 쓰는
                      크기다. 6px(h-1.5)은 적용 분야 칩이나 히어로 사양 라벨
                      처럼 상위 요소가 쓴다.

                      ⚠️ 체크 아이콘과 섞이지 않는다. 바깥 카드가
                         grid-cols-[auto_minmax(0,1fr)] 로 체크를 열 1 에
                         두므로, 이 목록은 열 2 안쪽에 들어간다.

                      mt-[10px] 는 4px 점을 15px 글의 첫 줄 가운데에 맞추는
                      값이다 — 줄 높이가 21.6px 라 (21.6 - 4) / 2 = 8.8 에
                      글상자 위 여백을 더한 값이고, 재서 맞췄다(7px 이면
                      2.6px 떠 보인다). 홈 PROCESS 는 글이 13px 한 줄이라
                      items-center 로 충분했다. */}
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {f.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-brand"
                        />
                        <span className="text-[15px] leading-relaxed text-ink-soft">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* KPI 넷. 값 - 라벨 - 조건 세 줄이 가로로 선다.

            특징 아래에 둔다. 위 카드 넷이 "그래서 무엇이 되는지" 를 산문으로
            말하고 나면, 같은 것을 숫자로 한 번 더 받는 자리다. 아래 사양
            섹션으로 넘어가기 전에 와야 한다 — 거기는 형식별 규격이라 결이
            다르다.

            ⚠️ 섹션을 따로 만들지 않는다. 이 섹션이 bg-surface, 아래 사양이
               bg-white 라 그 사이에 섹션을 끼우면 둘 중 하나와 배경이 붙어
               경계가 사라진다. 안에 두면 "이 특징들이 내는 수치" 로 한
               덩어리로 읽히고 섹션 수도 그대로다.

            border-t 가 위 카드 묶음과 가른다. 홈 PERFORMANCE 는 위가 영상
            이라 경계가 저절로 생기지만 여기는 흰 카드 격자라, 선이 없으면
            KPI 가 카드의 일부로 보였다. pt-10 과 mt-12 로 선 위아래를 비슷하게
            띄운다.

            ⚠️ dl 이 아니라 ul 이다. 홈에서 dl/dt/dd 로 짰다가 Lighthouse
               접근성이 96 으로 떨어졌다(definition-list 미통과) — dl 의 자식
               div 안에는 dt 와 dd 만 올 수 있는데 조건 줄이 p 라 섞인 탓이다.
               여기도 줄이 셋이고 용어-정의 쌍이 아니다.

            칸 사이 세로 구분선은 lg 부터만 긋는다. 1열.2열에서는 선이 뜻을
            잃는다.

            ⚠️ 선 색이 border-line 이 아니라 border-ink/10 이다. 이 섹션이
               bg-surface 라 line(229,231,235)은 바탕과 1.155:1 밖에 안 돼
               확대해 보면 거의 사라진다(Footer.tsx 에 같은 측정이 있다 —
               "흰 바탕이 사라지면 너무 흐려 안 보인다"). ink/10 이면
               1.220:1 이고, 홈이 흰 바탕에서 line 으로 내는 세기(1.238:1)와
               거의 같다. 즉 색만 바꿔 **같은 세기를 지킨 것**이다.
               흰 섹션으로 옮기면 border-line 으로 되돌린다.

            ⚠️ lg:pl-7 을 두지 말 것. 가운데 정렬에서는 왼쪽 패딩만 있으면
               글 덩어리가 오른쪽으로 밀린다. 칸 사이는 lg:gap-7 이 벌린다.

            ⚠️ StatCounter 를 쓰지 않는다. value 가 "7,200" 처럼 쉼표가 있고
               "2~3" 처럼 범위여서 숫자로 셀 수 없다. */}
        <ul className="mt-12 grid gap-8 border-t border-ink/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7 lg:text-center">
          {product.kpis.map((kpi, i) => (
            <Reveal
              as="li"
              key={kpi.label}
              delay={i * 80}
              className={i > 0 ? "lg:border-l lg:border-ink/10" : ""}
            >
              <p className="text-[34px] font-extrabold leading-none tracking-tight tabular-nums text-ink">
                {kpi.value}
                <span className="ml-0.5 text-lg font-bold text-brand">
                  {kpi.unit}
                </span>
              </p>
              <p className="mt-2.5 text-sm font-bold text-ink">{kpi.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {kpi.note}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 구동 영상 — 제품 특징 바로 다음이다.

          특징(카드 넷 + KPI 띠)이 "무엇을 하고 얼마나 되는가" 를 말하고 나면
          그것이 실제로 도는 모습을 보여 주는 자리다. 한때 제작 사양 다음에
          있었는데, 규격표를 다 읽고 난 뒤라 늦었다.

          ⚠️ 섹션 배경을 함께 옮겼다. 네 섹션을 완전히 번갈이로 둘 수는 없다
             — SPECIFICATIONS 를 surface 로 만들면 그 안의 "예시 규격" 안내
             박스.규격표 thead.사양 표 라벨 칸이 모두 bg-surface 라 배경에
             묻힌다. 그래서 붙는 자리를 한 군데로 줄였다.

               FEATURES        surface
               IN OPERATION    white     <- 여기
               SPECIFICATIONS  white     <- 위와 붙는다 (유일)
               OTHER PRODUCTS  surface   <- 회색으로 바꿔 ProductCard 를 살린다

             붙는 둘은 제목(eyebrow + h2)이 뚜렷하고 영상 섹션은 아래가
             비어 있어, 경계가 흐려도 구분된다.

          전폭 한 편이고 lg 부터 3:1 이다 — 홈 PERFORMANCE 와 같은 언어다.
          16/9 로 두면 1088px 폭에서 612px 라 화면을 다 먹는다.

          ⚠️ 버튼도 호버 반응도 없다. 누를 것이 없는 장식 영상이다
             (VideoEmbed 머리 주석에 내력이 있다 — 버튼을 달았더니 "눌러야
             재생되는 것" 처럼 읽혔다).

          ⚠️ Image 와 .hero-video 는 짝이다. globals.css 의
             prefers-reduced-motion 블록이 .hero-video 를 display:none 으로
             숨기므로, 움직임을 끈 사람에게는 뒤에 깔린 이 정지컷이 보인다.
             둘 중 하나만 두지 말 것. */}
      <Section
        size="compact"
        eyebrow="IN OPERATION"
        title="구동 영상"
      >
        <ProductVideo video={product.video} />
      </Section>

      <Section size="compact" eyebrow="SPECIFICATIONS" title="제작 사양">
        {/* 모델별 예시 규격표.

            ⚠️⚠️ 이 수치는 유신이 확인해 준 값이 아니다. 업계에서 쓰는 축과
                 일반값으로 짜 넣은 예시이고, 그래서 **표를 읽기 전에** 보이게
                 안내 줄을 표 위에 둔다(아래에 두면 다 읽은 뒤에야 보인다).
                 자세한 내력은 products.ts 의 specTable 주석에 있다.

            가로 스크롤은 표에만 건다. 열이 다섯이라 좁은 폭에서는 밀어서
            봐야 하는데, 페이지 자체가 가로로 넘치면 안 된다.

            table 을 쓴다 — 행과 열이 모두 뜻을 갖는 자료라 dl 로는 형식별
            비교가 전달되지 않는다. th 에 scope 를 준다. */}
        {product.specTable && (
          <Reveal className="mb-8">
            <div className="flex items-start gap-2.5 rounded-xl bg-surface px-4 py-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-muted"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <p className="text-[13px] leading-relaxed text-ink-soft">
                {/* &nbsp; 넷이다. HTML 은 연속 공백을 하나로 접으므로
                    보통 공백으로는 벌릴 수 없다(홈 ABOUT US 박스가 쓰는 것과
                    같은 방법이다). 1~5칸을 찍어 비교했다 — 1~2칸은 라벨이
                    설명에 붙어 읽히고, 5칸은 두 덩어리로 갈라진다. */}
                <b className="font-bold text-ink">예시 규격</b>&nbsp;&nbsp;&nbsp;&nbsp;실제
                값은 공급할 부품에 따라 산출합니다. {product.specTable.caption}
              </p>
            </div>

            <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-surface">
                    {product.specTable.columns.map((col) => (
                      <th
                        key={col}
                        scope="col"
                        className="whitespace-nowrap px-4 py-3 font-bold text-ink"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {product.specTable.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className={`whitespace-nowrap px-4 py-3 ${
                            i === 0
                              ? "font-bold tabular-nums text-ink"
                              : "tabular-nums text-ink-soft"
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        )}

        {/* 표와 그 아래 안내 문단은 한 덩어리로 읽히므로 한 겹으로 묶는다. */}
        <Reveal>
          {/* 한 행에 두 쌍을 넣는다. 전에는 행마다 flex 였는데 dd 에 flex-1
              이 없어 dd 가 내용 크기만큼만 차지했다 — 1088px 표에서 dt 176 +
              dd 125px 를 쓰고 787px 가 빈 채, 값이 행마다 다른 곳(125~322px)
              에서 끝나고 구분선만 끝까지 그어졌다.

              42개 값을 전부 재니 가장 긴 것이 282px("경첩 · 잠금 구조 (부품
              보충 · 지그 점검 시 개방)")이고 라벨은 68px("거칠기 등급")가
              최대였다. 한 행에 두 쌍이 들어간다.

              앞 세 줄은 히어로 "주요 사양" 카드가 가져가므로 여기서는
              slice(3) 으로 뒤 세 줄만 쓴다. 세 쌍이라 한 열(두 칸)이다 —
              한때 여섯 줄을 두 쌍씩 놓아 네 칸으로 만들었는데, 세 쌍이 되면
              마지막 한 쌍이 빈 칸을 둘 남긴다. 표 높이는 어느 쪽이든 세 행
              168px 로 같다.

              라벨 칸 9rem(144px) — 가장 긴 라벨 68px("거칠기 등급")에 글상자
              104px 로 여유가 있다. 남는 값 21개의 최대 폭이 282px 라 dd 칸
              (1440 944px, 768 542px)에서 당연히 한 줄이다. 640 미만은 dt/dd
              세로 스택이다.

              격자선은 셀마다 border-b 다. 위 예시 규격표의 divide-y 와 같은
              방식이라 두 표의 선 굵기가 같아진다.

              ⚠️ 한때 gap-px + bg-line(격자 틈에 바탕이 비치게)이었는데 그
                 선이 위 표보다 굵어 보였다. 재 보니 테두리는 0.8px, 격자 틈은
                 1px 다 — 틈은 테두리처럼 스냅되지 않아 안티앨리어싱 없이
                 또렷하게 떨어지고, bg-line 이 dl 전체 배경이라 칸 높이가
                 소수점에서 모자라면 그 잔여분이 선에 더해진다. dt|dd 세로선과
                 만나는 교차점은 흰 여백 없는 1px 십자가 되고, 회색 라벨 칸과
                 흰 값 칸 사이를 지나는 탓에 같은 선이 "흐렸다 진했다" 한다.

              ⚠️ 그때 "셀마다 border-b 를 주면 마지막 행에서 바깥 테두리와
                 겹쳐 이중선이 되고, 그 마지막 행이 폭마다 달라져 끌 수가
                 없다" 고 적어 두었는데, 그건 여섯 줄을 두 쌍씩 2열로 놓던
                 때의 이야기다. 지금은 세 쌍 한 열이라 마지막 행이 늘 마지막
                 쌍이고, sm 미만 1열에서도 마지막 dd 하나다 — 인덱스로 정확히
                 끌 수 있다(오시는 길 연락처 표가 같은 방법을 쓴다).

              dt/dd 는 격자 직계여야 한다(접근성 검사 dlitem). 그래서 묶는
              div 대신 Fragment 를 쓴다. */}
          {/* 바깥 테두리가 border 다. gap-px + bg-line 은 칸 사이 선만
              만드는데, 값 칸이 흰색이고 섹션 바탕도 흰색이라 가장자리가
              어디서 끝나는지 보이지 않았다 — 표가 잘린 것처럼 읽혔다.

              ⚠️ 한때 p-px(바깥 1px 패딩에 bg-line 이 비치게)로 테두리를
                 만들었는데, 반경 16px 짜리 둥근 모서리에서 그 1px 가 곡선을
                 따라 가늘어져 끊긴 것처럼 보였다. border 는 border-radius 를
                 따라 그려지는 표준 테두리라 모서리에서 끊기지 않는다.
                 위 예시 규격표도 border-line 이라 두 표가 같은 방식이 된다. */}
          <dl className="grid overflow-hidden rounded-2xl border border-line sm:grid-cols-[9rem_minmax(0,1fr)]">
            {product.specs.slice(3).map((spec, i, all) => (
              <Fragment key={spec.label}>
                {/* 패딩이 px-4 py-3 인 것은 위 예시 규격표와 맞추기 위해서다.
                    한때 px-5 py-4 라 행 높이가 55px 였는데(위 표는 44px),
                    그 11px 차이에 라벨 열의 회색 띠가 더해져 표가 두껍고
                    가로선도 굵어 보였다. 선 자체는 전부터 1px 로 같았다.

                    dd 에서 leading-relaxed 도 걷었다. 패딩만 맞췄더니 47px 로
                    3px 가 남았는데, 줄높이가 1.625(22.75px)라 위 표의 기본
                    1.25rem(20px)보다 높았던 탓이다. 지금 값은 모두 한 줄이라
                    넉넉한 줄높이가 필요 없다 — 두 줄짜리 값이 생기면 그때
                    되살리고 위 표와 높이가 갈리는 것을 받아들인다. */}
                <dt
                  className={`bg-surface px-4 py-3 text-sm font-bold text-ink ${
                    i === all.length - 1 ? "" : "border-b border-line"
                  }`}
                >
                  {spec.label}
                </dt>
                <dd
                  className={`bg-white px-4 py-3 text-sm text-ink-soft sm:border-l sm:border-line ${
                    i === all.length - 1 ? "" : "border-b border-line"
                  }`}
                >
                  {spec.value}
                </dd>
              </Fragment>
            ))}
          </dl>

          {/* 한때 이 아래에 "위 규격은 예시입니다 …" 안내 박스가 하나 더
              있었다. 표 위 안내가 생기면서 같은 말이 두 번이 되어 걷었다 —
              먼저 읽히는 쪽을 남긴다. */}
        </Reveal>

        <h3 className="mt-12 text-lg font-bold text-ink">적용 분야</h3>
        {/* 분야가 부품군을 가리키는 제품(지금은 볼피더뿐)은 사진 카드로,
            "볼피더 구동부" 처럼 자리를 가리키는 나머지는 칩으로 그린다.
            데이터가 둘을 구분한다 — products.ts 의 applications 참고.
            한 제품 안에서 섞이면 그 파일 끝의 검사가 빌드를 멈춘다. */}
        {typeof product.applications[0] === "string" ? (
          <Reveal>
            {/* 칩에 레드 점을 붙인다. 위 히어로의 분류 배지가 이미
                rounded-full + border-line + bg-surface + bg-brand 점이라,
                같은 언어를 쓰면 한 페이지에서 칩이 한 가지 생김새로 읽힌다.
                히어로 "주요 특징" 은 체크, 여기는 점 — 마커가 달라 둘이
                섞이지 않는다. */}
            <ul className="mt-4 flex flex-wrap gap-2">
              {(product.applications as string[]).map((a) => (
                <li
                  key={a}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-soft"
                >
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <ApplicationCases
            cases={product.applications as ApplicationCase[]}
          />
        )}
      </Section>

      {/* 목록 페이지와 똑같은 세로 카드다 — ProductCard 를 그대로 쓴다.
          가로 카드(352x98)와 전폭 한 줄 목록을 거쳐 여기로 돌아왔다: 사진이
          80px 썸네일이거나 아예 없으면 어느 제품인지 글자로만 알아야 했다.
          참고로 받은 신창에프에이 nsc-parts-feeder 의 "관련 제품" 도 사진
          있는 3열 카드(389x424, 사진 4:3)다.

          사진 칸은 4:3 이다. 한때 여기만 2:1 로 낮춰 카드를 작게 뒀는데,
          원본이 모두 4:3 이라 318px 칸에 212px 로 그려지고 좌우에 53px 씩 흰
          띠가 남았다. 띠를 없애는 방법은 칸을 원본 비율에 맞추는 것뿐이다 —
          object-cover 는 세로를 33% 자르고, 4:3 이 아닌 두 장(진동기 0.98,
          컨트롤러 1.06)은 45~51% 잘린다.

          크기는 간격이 잡는다. 이 페이지는 /products 와 달리 왼쪽 분류
          사이드바가 없어 격자가 Container 1088px 를 다 쓴다(목록 쪽은 848px 를
          셋으로 나눠 카드가 267px 다). 간격 64px 이면 카드가 320px 가 되어
          사진이 318x239 로 목록보다 20% 커지므로, xl 에서 144px 로 벌려 카드를
          266.7px 에 맞춘다 — 사진 265x199 로 목록 카드와 치수가 같아진다.

          간격이 세 단계인 이유는 tagline 이다. 일곱 tagline 을 14px/1.625 로
          1px 씩 재 보면 모두 두 줄인 글상자 폭이 213~307px 인데(좁은 쪽 한계는
          직진피더 37자, 넓은 쪽은 방음커버 32자), 폭마다 Container 가 달라
          간격을 하나로 두면 어느 한쪽이 그 창을 벗어난다.

            폭    열  Container  간격   카드  글상자
            640   2      560      24    268    219
            768   2      688      24    332    283
            1024  3      944      64    272    222
            1280  3     1088     144    267    217

          1024 에서 144px 를 쓰면 카드가 218px 로 줄어 글상자가 169px(세 줄)가
          되므로 lg 는 64px 그대로 두고 xl 에서만 벌린다. sm.md 에 64px 을 뒀을
          때는 640 글상자가 199px 로 떨어져 직진피더.진동기가 세 줄이었다.
          세로는 gap-y-8 로 따로 둔다 — sm.md 는 2열이라 카드 셋이면 2행이
          되는데 64px 은 너무 벌어진다.

          배경을 흰색으로 둔다(위 "제작 사양" 과 같다). /products 는 흰 카드를
          일부러 회색 판에 올리는데(그 파일 주석: 흰 바탕에 흰 카드면 테두리
          1px 말고는 경계가 없어 격자가 평평해 보였다), 거기는 일곱 장이 꽉 찬
          격자고 여기는 두세 장이라 테두리와 그림자만으로도 카드가 선다.

          섹션은 약 609 -> 648px 가 된다. */}
      {/* 회색이다. 흰 카드(ProductCard)가 회색 위에서 또렷해지고, 바로 위
          SPECIFICATIONS 와도 갈린다 — 특징 카드가 회색 섹션에 놓인 것과 같은
          이유다. */}
      <Section
        tone="surface"
        size="compact"
        eyebrow="OTHER PRODUCTS"
        title="다른 제품"
      >
        {/* 간격은 가로.세로 모두 24px 다. 한때 lg:gap-x-16 xl:gap-x-36
            (144px)이었는데, 카드 셋이 멀찍이 떨어져 한 묶음으로 안 읽혔다.
            사이트의 다른 카드 격자와 같은 값으로 맞춘다(FEATURES gap-6,
            적용 분야 gap-4). */}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <ContactCTA />
    </>
  );
}
