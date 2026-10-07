import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import Section from "@/components/Section";
import { process } from "@/data/company";
import ClientGrid from "@/components/ClientGrid";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import StatCounter from "@/components/StatCounter";
import { featuredClients, totalClients } from "@/data/clients";
import { performanceKpis, products } from "@/data/products";
import { site, yearsInBusiness } from "@/data/site";
import VideoCard from "@/components/VideoCard";
import { featuredVideos } from "@/data/videos";

/** count=false 인 값은 세어 올리지 않는다 — 연도가 굴러가면 어색하다. */
const STATS = [
  {
    value: 1992,
    count: false,
    unit: "년 설립",
    note: `${yearsInBusiness}년째 한 분야`,
  },
  {
    value: yearsInBusiness,
    count: true,
    unit: "년 제작 경력",
    note: "설계부터 튜닝까지",
  },
  { value: totalClients, count: true, unit: "개사", note: "주요 거래처" },
  { value: products.length, count: true, unit: "종 제품", note: "피더 전 라인업" },
];

/* "자세히 보기 / 전체 보기" 버튼. 영상자료의 "영상 더 보기" 와 같은
   모양이다. (오시는 길의 지도앱 버튼도 같은 꼴이었는데 그 블록이 걷혔다.) */
const BTN =
  "group inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand";

export default function Home() {
  return (
    <>
      {/* 히어로 배경 영상의 정지컷. 영상이 뜨기 전까지 이게 보이므로 미리
          알려 LCP 를 앞당긴다. 영상 자체는 preload 하지 않는다 — 첫 화면
          페인트가 늦어진다. (React 가 이 link 태그를 <head> 로 끌어올린다)

          ⚠️ 한때 layout.tsx 에 있었다. 레이아웃은 열 페이지 전부에 붙으므로,
             이 그림을 쓰지 않는 제품 상세.영상자료.오시는 길에서도 47KB 를
             fetchPriority="high" 로 헛받았다 — 바로 그 자리에서 정작 받아야
             할 제품 사진.구동 영상과 대역을 다퉜다. 홈에만 둔다. */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-poster.webp"
        fetchPriority="high"
      />

      {/* 1. Hero — 헤더를 뺀 한 화면에 지표 줄까지 전부 들어가야 한다.
          화면이 낮아지면 패딩·글자·이미지가 clamp()로 같이 줄어든다. */}
      <section className="hero-screen relative flex flex-col overflow-hidden bg-navy-deep">
        {/* 배경 2 — 실제 피더가 도는 영상.

            유튜브 iframe 을 쓰지 않는다. 홈은 외부 요청이 0건이고(그러려고
            영상 페이지도 VideoEmbed 파사드를 둔다), iframe 을 배경에 박으면
            열기만 해도 유튜브로 요청이 나가고 LCP 도 나빠진다. 자체 호스팅 mp4 다.

            아래에 같은 장면 정지컷을 깔아 둔다 — 영상이 뜨기 전과 "움직임 줄이기"
            설정에서 그대로 보이게 하려는 것이다(globals.css 의 .hero-video 참고).

            opacity 는 바깥 한 겹에만 건다 — 두 겹에 걸면 어두워진다.
            drift(느린 확대)는 걸지 않는다 — 영상 자체가 움직여 겹치면 과하다.

            0.5 였다가 0.3 으로 내렸다. 히어로의 겹을 다섯에서 둘로 줄이면서
            가장자리 비네트와 3D 도면 뒤를 눌러 주던 겹이 없어졌는데, 영상에는
            밝은 구간이 있어 그 프레임에서 도면과 글자가 흐려졌다. 스크림을
            다시 얹는 대신 영상 자체를 한 단계 낮춘다 — 겹은 둘로 남고 배경이
            조용해진다. 영상은 여전히 보인다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.3]"
        >
          <Image
            src="/images/hero-poster.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* muted 가 없으면 자동재생이 막히고, playsInline 이 없으면 모바일에서
              전체화면으로 튄다. preload 는 metadata — 첫 화면 페인트를 안 막는다. */}
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster="/images/hero-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
        {/* 배경 3 — 글자가 읽히도록 덮는 네이비 오버레이.

            ⚠️ 이 한 겹이 글자 가독성을 혼자 맡는다. 지우면 영상 위에서 흰
               글자가 읽히지 않는다.

            한때 히어로에 겹이 다섯이었다 — 바닥 그라디언트, 영상, 이 오버레이,
            가장자리 비네트, 3D 도면 뒤를 눌러 주는 자리. 하위 페이지 배너는
            장식을 모두 걷어 바탕 한 장으로 세웠는데 홈만 다섯이라, 영상(제품이
            도는 모습이니 내용이다)과 이 오버레이만 남겼다. 바닥 그라디언트는
            section 의 bg-navy-deep 과 거의 같은 색을 한 번 더 까는 것이었고,
            비네트와 도면 뒤 자리는 도면이 흰 금속이라 어두운 영상 위에서 그
            자체로 구분돼 없어도 읽힌다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/75 to-transparent"
        />

        <Container className="relative flex flex-1 items-center py-[clamp(1.5rem,4vh,3.5rem)]">
          <div className="grid w-full items-center gap-[clamp(1.5rem,3.5vh,3.5rem)] lg:grid-cols-[1.1fr_1fr]">
            <div>
              {/* 로고의 F.A 가 무엇의 약자인지 풀어 주는 자리다.
                  로고에는 "유신 F.A SYSTEM" 만 크게 보이고 그 아래 작은
                  영문은 눈에 잘 안 들어온다.

                  전에는 "SINCE 1992 · FEEDING AUTOMATION SYSTEM" 이었다.
                  SINCE 1992 를 뺀 것은 같은 화면에서 세 겹으로 겹쳤기
                  때문이다 — 지표 띠의 "1992년 설립", 본문의 "34년째",
                  지표의 "34년 제작 경력". 덤으로 그 긴 문구(313px)가
                  320·360 에서 두 줄로 깨지던 것도 없어졌다(이건 216px 라
                  320 에서도 한 줄이다). */}
              <p
                className="rise text-[clamp(0.625rem,1.1vh,0.75rem)] font-bold tracking-[0.25em] text-brand-light"
                style={{ animationDelay: "60ms" }}
              >
                {site.tagline}
              </p>
              <h1
                className="rise mt-[clamp(0.75rem,2vh,1.25rem)] text-[clamp(1.6rem,4.4vh,3.4rem)] font-bold leading-[1.25] tracking-tight text-white"
                style={{ animationDelay: "140ms" }}
              >
                부품 자동정렬 공급기,
                <br />
                <span className="text-brand-light">설계부터 튜닝까지</span>{" "}
                {/* 좁은 칼럼에서 "직접 / 만듭니다"로 끊기지 않게 묶어 둔다 */}
                <span className="whitespace-nowrap">직접 만듭니다</span>
              </h1>
              {/* 한 문장이다. 전에는 두 문장(63자)이라 데스크톱에서도 두
                  줄, 320~430 에서는 서너 줄이었다.

                  "34년째" 가 빠진 자리를 눈여겨볼 것. 바로 아래 지표 띠가
                  "1992년 설립" 과 "34년 제작 경력" 으로 이미 두 번 말한다 —
                  위 tagline 주석이 SINCE 1992 를 뺀 이유로 적어 둔 바로 그
                  세 겹이다. 한 줄에 담을 수 있는 말이 하나뿐이라면, h1 과
                  지표 띠가 말하지 않는 "보낸 부품에 맞춰 설계한다" 를
                  남기는 쪽이 새 정보를 준다.

                  실측 — 640~1440 에서 1줄, 320~430 에서 2줄. 폰에서 1줄은
                  어떤 후보로도 안 된다(후보 일곱을 폭마다 재 봤다). */}
              <p
                className="rise mt-[clamp(0.75rem,2vh,1.5rem)] max-w-xl text-[clamp(0.875rem,1.9vh,1.125rem)] leading-relaxed text-white/75"
                style={{ animationDelay: "220ms" }}
              >
                볼피더·직진피더·호퍼피더를 부품 샘플에 맞춰 설계합니다.
              </p>

              <div
                className="rise mt-[clamp(1.25rem,3vh,2.25rem)] flex flex-row gap-3"
                style={{ animationDelay: "300ms" }}
              >
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark sm:px-8"
                >
                  제품 살펴보기
                  <ArrowRight />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-xl border border-white/45 px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:border-white/70 hover:bg-white/10 sm:px-8"
                >
                  견적 문의하기
                </Link>
              </div>
            </div>

            {/* 폰에서는 문구·버튼·지표를 한 화면에 넣을 자리가 없어 도면을 감춘다.
                배경 질감은 그대로 남는다. */}
            <div
              className="rise-zoom hidden justify-center sm:flex"
              style={{ animationDelay: "380ms" }}
            >
              <Image
                src="/images/hero-unit.webp"
                alt="파츠피더 구동부(진동기) 3D 도면"
                width={659}
                height={672}
                priority
                className="h-auto max-h-[min(30svh,340px)] w-auto object-contain drop-shadow-2xl lg:max-h-[min(42svh,460px)]"
              />
            </div>
          </div>

          <ScrollCue />
        </Container>

        {/* 2. 지표 스트립 — 섹션 맨 아래에 붙어 항상 첫 화면 안에 보인다 */}
        <div className="relative border-t border-white/10 bg-black/25 backdrop-blur-[2px]">
          <Container>
            <dl className="grid grid-cols-2 divide-white/10 sm:grid-cols-4 sm:divide-x">
              {STATS.map((s, i) => (
                <div
                  key={s.unit}
                  className="rise px-1 py-[clamp(0.75rem,2.2vh,1.75rem)] sm:px-6 sm:text-center"
                  style={{ animationDelay: `${460 + i * 70}ms` }}
                >
                  <dd className="order-first">
                    <StatCounter
                      value={s.value}
                      count={s.count}
                      className="text-[clamp(1.375rem,3.2vh,2.25rem)] font-bold tabular-nums text-white"
                    />
                    <span className="ml-1 text-sm font-medium text-white/60">
                      {s.unit}
                    </span>
                  </dd>
                  <dt className="mt-1 text-[clamp(0.625rem,1.3vh,0.75rem)] text-white/45">
                    {s.note}
                  </dt>
                </div>
              ))}
            </dl>
          </Container>
        </div>
      </section>

      {/* 3. 제품 성능 */}
      {/* 제품이 무엇을 해내는가를 숫자로 말하는 자리다.

          한동안 여기가 회사를 말하는 자리였다 — "피더를 만드는 데 필요한 것"
          에 부서.설비.쌓인 사례를 적은 글 상자 다섯. 그 전에는 "피더란
          무엇인가" 였다. 글 상자는 읽어야 뜻이 오는데, 홈에서 이 자리를 보는
          사람은 아직 읽을 마음이 없다. 숫자는 보면 바로 온다.

          ⚠️ 바로 위 히어로 지표 띠(1992.34년.34개사.7종)와 축이 다르다 —
             그쪽은 회사의 규모.연혁이고 여기는 기계의 성능이다. 숫자를 더하거나
             바꿀 때 그 넷과 겹치지 않는지 본다.

          버튼(action)을 두지 않는다. 내용이 제품 성능이라 "회사소개 자세히
          보기" 는 결이 안 맞고, "제품 전체 보기" 는 바로 아래 PRODUCTS 섹션
          버튼과 겹친다. /company 동선은 헤더.푸터 메뉴에 있다. 대신 lead
          한 줄이 제목을 받는다. */}
      {/* 제목이 제품의 동작을 그대로 말한다. 한때 "한 자세로, 멈추지
          않고" 에 "부품을 같은 자세로 가려 세워, 라인이 멈추지 않게 합니다"
          라는 리드가 붙어 있었는데, 둘이 같은 말이라 리드를 걷고 제목만
          남겼다. 아래가 바로 영상이라 설명 줄이 더 필요하지 않다.

          후보 다섯을 글상자에 그려 폭마다 쟀다 — 320 에서 2줄, 390 이상
          한 줄이다. */}
      <Section eyebrow="PERFORMANCE" title="쏟아 넣으면 한 줄로 나옵니다">
        {/* 정지 사진이던 자리다. 피더가 무엇인지는 "부품이 돌다가 한 줄로
            서서 나간다" 는 움직임 자체라, 멈춘 사진으로는 절반만 전해졌다.

            히어로가 쓰는 영상을 그대로 건다. 볼피더가 커넥터 부품을 정렬해
            트랙으로 내보내는 10초짜리인데, 히어로에서는 opacity 0.3 에
            네이비 오버레이까지 덮여 거의 안 보인다 — 같은 파일이어도 여기서
            밝게 돌면 다른 영상처럼 읽히고, 이미 받는 파일이라 전송량도
            늘지 않는다.

            1024 미만은 16/9 다 — 영상 원본과 같은 비율이라 아무 데도 잘리지
            않는다. lg 부터는 3/1 로 눕힌다. 전체 폭(1088px)에서 16/9 면
            612px 라 영상이 화면을 다 먹고 아래 KPI 가 밀려난다. 3/1 이면
            363px 이고, 제목.영상.KPI 넷이 1440x900 한 화면에 들어온다.

            object-cover 가 위아래를 자르지만 트랙이 화면을 가로지르는 장면
            이라 부품이 가운데 남는다 — 눈으로 확인했다.

            ⚠️ Image 가 아래 깔려 있는 것은 장식이 아니다. globals.css 의
               prefers-reduced-motion 블록이 .hero-video 를 display:none 으로
               숨기므로, 움직임을 끈 사람에게는 이 정지컷이 보인다. 영상에서
               뽑은 그림이라 장면이 어긋나지 않는다. 지우면 그 사람에게 빈
               칸만 남는다. */}
        <Reveal className="relative aspect-video overflow-hidden rounded-2xl bg-surface lg:aspect-[3/1]">
          <Image
            src="/images/hero-poster.webp"
            alt="커넥터 부품을 정렬해 트랙으로 내보내는 볼피더"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <video
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster="/images/hero-poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>

          {/* 자막. 제목("쏟아 넣으면 한 줄로 나옵니다")이 비유라면 이쪽은
              장면 그대로를 말한다 — 위 Image 의 alt 와 같은 사실이다.
              제품 상세 구동 영상(ProductVideo)과 같은 꼴이다.

              ⚠️ <video> 가 아니라 **칸**의 자식이다. 그래야 '움직임 줄이기'
                 에서 영상이 display:none 이 되어도 뒤에 깔린 정지컷 위에
                 자막이 남는다.

              ⚠️ 흰 글씨가 읽히는 것은 그라데이션 덕이다. hero.mp4 하단 띠를
                 재니 lg 3:1 로 잘린 뒤 Y 115~122(자르기 전 127~130)인데,
                 navy-deep/85 를 덮으면 Y 49 로 떨어져 대비가 약 12.2:1 이
                 된다(AAA 7:1 의 1.7배). 영상을 갈아 끼울 때 하단이 더 밝으면
                 다시 잰다.

              세로는 늘지 않는다 — 영상 위에 겹치므로 아래 KPI 띠와의 간격
              48px 가 그대로다. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/40 to-transparent px-5 pb-5 pt-12 sm:px-6 sm:pb-6">
            <p className="text-[13px] font-medium leading-relaxed text-white sm:text-sm">
              볼피더가 커넥터를 한 자세로 가려 트랙으로 내보냅니다.
            </p>
          </div>
        </Reveal>

        {/* KPI 넷. 값 - 라벨 - 조건 세 줄이다.

            ⚠️ 한때 값 · 라벨 · **조건** 세 줄이었다. 조건 줄(kpi.note)을
               걷어 달라는 요청에 화면에서만 뺐다 — 데이터는 products.ts 에
               그대로 있다(실제 수치를 받을 때 함께 되살린다). 띠가 93 -> 68px 다.

            ⚠️ dl 이 아니라 ul 이다. 처음에 히어로 지표 띠를 따라 dl/dt/dd 로
               짰다가 Lighthouse 접근성이 96 으로 떨어졌다(definition-list 미통과,
               agent-accessibility-tree 0). dl 의 자식 div 안에는 dt 와 dd 만
               올 수 있는데 조건 줄이 p 라 섞인 탓이다. 히어로 띠가 통과하는
               것은 거기가 dd + dt 둘뿐이라서다.

               여기는 줄이 셋이고 용어-정의 쌍도 아니다 — 측정값 목록이라
               ul/li 가 뜻에도 맞다.

            칸 사이는 세로 구분선이다. 시안 셋(맨 글자 / 구분선 / 회색 박스)을
            찍어 비교했다 — 회색 박스는 아래 제품 카드와 결이 겹쳐 KPI 의
            시원함이 줄고, 맨 글자는 흰 바탕에서 네 덩어리가 흩어져 보인다.
            1열.2열에서는 선이 뜻을 잃으므로 lg 부터만 긋는다.

            lg 부터 가운데 정렬이다. 왼쪽 정렬일 때 네 덩어리가 각 칸의 왼쪽에
            붙어, 전체 폭으로 선 영상과 축이 어긋나 보였다. 1열.2열에서는
            왼쪽을 지킨다 — 좁은 폭에서 가운데로 모으면 글이 떠 보인다.

            ⚠️ lg:pl-7 을 두지 말 것. 구분선과 글을 띄우려고 넣었던 것인데,
               가운데 정렬에서는 왼쪽 패딩만 있으면 글 덩어리가 오른쪽으로
               밀린다. 칸 사이는 lg:gap-7 이 벌린다.

            ⚠️ StatCounter 를 쓰지 않는다. 바로 위 히어로 지표 띠가 이미 세어
               올리고 있어, 한 화면에서 숫자가 두 번 구르면 산만하다. */}
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-7 lg:text-center">
          {performanceKpis.map((kpi, i) => (
            <Reveal
              as="li"
              key={kpi.label}
              delay={i * 80}
              className={i > 0 ? "lg:border-l lg:border-line" : ""}
            >
              <p className="text-[34px] font-extrabold leading-none tracking-tight tabular-nums text-ink">
                {kpi.value}
                <span className="ml-0.5 text-lg font-bold text-brand">
                  {kpi.unit}
                </span>
              </p>
              <p className="mt-2.5 text-sm font-bold text-ink">{kpi.label}</p>

            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 4. 제품 라인업 */}
      <Section
        tone="surface"
        eyebrow="PRODUCTS"
        title="제품 라인업"
        action={
          /* VIDEO.CLIENTS.PROCESS 와 같은 자리.같은 꼴이다. */
          <Link href="/products" className={BTN}>
            제품 전체 보기
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        }
      >
        {/* 셋만 건다. 일곱 개를 다 늘어놓으면 3+3+1 로 끊겨 마지막 줄에 한
            칸만 남고, 홈에서 제품을 "훑어보는" 자리가 제품 목록 페이지와
            같아진다. 앞 셋은 배열 순서 그대로다 — 볼피더가 본체, 직진피더가
            이송, 진동기가 구동부로 피더 한 벌의 뼈대다. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product, i) => (
            <Reveal key={product.slug} delay={i * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5. 제작 프로세스 */}
      <Section
        eyebrow="PROCESS"
        title="문의부터 납품까지"
        action={
          /* 제작 과정을 읽은 다음이 문의로 가기 가장 자연스러운 자리다.
             VIDEO.CLIENTS 섹션의 "전체 보기" 와 같은 꼴이다.

             글자가 "견적 문의하기" 가 아닌 것은 히어로 버튼이 이미 그 말을
             쓰고 있어서다. 한 페이지에 같은 글자 버튼이 둘이면 눌러 본 것을
             또 누르게 된다. 여기는 바로 위에서 제작 과정을 읽은 자리라
             "제작" 쪽이 맥락에도 맞는다. */
          <Link href="/contact" className={BTN}>
            제작 문의하기
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        }
      >
        {/* 떨어진 그림자 카드다. 사이트의 카드 언어가 rounded-2xl +
            shadow-card 이므로 여기도 같은 모양으로 둔다.

            (한때 "바로 위 유신의 강점 섹션과 겹치지 않게" 라고 적어 두었는데,
            그 섹션을 걷어내 더는 해당되지 않는다.)

            숫자는 brand 다. 네이비 위에서 쓰던 brand-light(#ff6b5e)는 흰
            바탕에서 3.0:1 로 떨어진다(brand #d5261e 는 5.1:1). */}
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal
              as="li"
              key={p.step}
              delay={i * 80}
              className="rounded-2xl bg-white p-6 shadow-card"
            >
              {/* 번호 + 제목. 번호는 제목 **위** 별도 줄에 작게 선다.

                  ⚠️ 동그라미로 네 번 시도하고 접었다. 56px 워터마크는 제목만큼
                     무거워 답답했고, 24px 원은 반대로 허전했고, 그 사이인
                     32px 도 "동그라미 자체가 어색하다" 였다. 크기 문제가
                     아니었다 — 번호를 제목과 **같은 줄**에 세우면 둘이 가로로
                     경쟁하고, 원이 그 경쟁을 키운다. 바탕을 깐 원 넷이 카드마다
                     왼쪽에 떠 있는 것도 레드를 한 점에만 쓰는 이 사이트에서
                     면적이 과했다.

                     지금은 12px 레드 글자 넷뿐이라 레드 면적이 가장 좁고,
                     "번호 -> 제목 -> 할 일 셋" 이 위에서 아래로 한 방향으로
                     읽힌다. 다시 원으로 돌아가지 말 것.

                  ⚠️ /contact 의 "도입 프로세스" 는 24px 원 배지 **그대로**다.
                     거기는 세로 목록이고 글상자가 287~319px 뿐이라 결이 다르다.
                     같은 데이터(company.ts 의 process)를 두 자리에 쓰므로
                     한쪽을 고칠 때 다른 쪽도 보되, **생김새는 이제 다르다.**

                  p.step 이 이미 "01"~"04" 다 — 한때 {i + 1} 로 다시 셌는데
                  (24px 원에 두 글자가 빽빽해서였다) 이제 자리가 넉넉해
                  데이터에 있는 값을 그대로 쓴다.

                  ⚠️ aria-hidden 을 떼지 말 것. 순서는 ol / li 가 이미 전하므로
                     시각 보조다(/contact 주석과 같은 이유). */}
              <div className="flex items-center justify-between gap-2">
                <p
                  aria-hidden="true"
                  className="text-xs font-bold tracking-[0.08em] tabular-nums text-brand"
                >
                  {p.step}
                </p>
                {/* 다음 단계가 있다는 표식. 번호 13px 뒤의 빈 자리를 쓴다.

                    ⚠️ 한때 카드 **밖**에 절대배치였다(-right-[18px] 로 틈
                       한가운데, lg 부터만). 카드 안으로 들어오면서 두 가지가
                       달라졌다 — (1) 옆 카드를 가리키는 것이 아니라 "다음이
                       있다" 는 표식이라 **모든 폭에서** 띄운다(밖에 있을 때는
                       2열에서 2->3 이 줄바꿈이라 엉뚱한 곳을 가리켰다),
                       (2) 카드의 relative 가 필요 없어져 함께 걷었다.

                    ⚠️ 꺾쇠 둘이다. 사이트의 버튼 화살표는 전부 선(M5 12h14) +
                       화살촉인데, 같은 카드 바닥에 체크가 있고 위에 또 그 그림을
                       두면 기호가 섞인다. 꺾쇠 계열은 겹치지 않는다.

                    ⚠️ 레드로 바꾸지 말 것. 아래 주석의 "카드 안 레드가 셋 —
                       번호 · 기간 칩 · 체크 — 여기에 넷째를 더하지 말 것" 이
                       그대로 적용된다.

                    ⚠️ text-muted 다. 한때 text-line 이었는데 흰 카드 위에서
                       대비가 1.2:1 이라 거의 보이지 않았다. muted 는 4.8:1 로
                       또렷하면서도 레드 번호보다 먼저 읽히지는 않는다
                       (line · muted/50 · muted · ink/25 를 그려서 골랐다). */}
                {i < process.length - 1 && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="shrink-0 text-muted"
                  >
                    <path d="m7 6 6 6-6 6" />
                    <path d="m14 6 6 6-6 6" />
                  </svg>
                )}
              </div>
              <h3 className="mt-1.5 text-base font-bold text-ink">{p.title}</h3>
              {/* 공정 사진.

                  한때 여기 점 목록 셋이 있었다("부품 샘플 또는 도면 접수" 식).
                  글로만 늘어놓으니 네 카드가 비슷해 보여, 사진으로 바꿨다.

                  ⚠️ 카드 패딩 안에 둔다(-mx-6 으로 넘기지 않는다). 넘기면 카드
                     모서리와 사진 모서리가 겹쳐 면이 두 겹으로 읽힌다 — 점
                     목록이 회색 박스를 거부하던 것과 같은 이유다. 사진이
                     212px 로 작아지는 것은 그 대가로 받는다.

                  ⚠️ rounded-xl 이다. 카드가 rounded-2xl 이라 안쪽은 한 단계
                     작아야 두 모서리가 같은 곡률로 겹쳐 보이지 않는다.

                  bg-surface 는 사진이 뜨기 전 자리를 지킨다. 첫 화면 밖이라
                  next/image 가 lazy 로 받는다.

                  ⚠️ 사진은 유신이 찍은 것이 아니다 — company.ts 의 process
                     주석과 scripts/fetch-process-photos.mjs 참고. */}
              <div className="relative mt-4 aspect-video overflow-hidden rounded-xl bg-surface">
                <Image
                  src={p.photo}
                  alt={p.photoAlt}
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* 사진 위 자막. 제품 구동 영상(ProductVideo)과 홈 영상 카드가
                    쓰는 그 꼴이다 — 파란 그라데이션 위에 흰 글 한 줄.

                    ⚠️ <Image> 가 아니라 **칸**의 자식이다. 그래야 사진이 아직
                       안 떴거나 못 받았을 때도 띠가 남는다.

                    ⚠️ 글이 한 줄이어야 한다. 가장 좁은 1024 에서 사진이 176px,
                       자막 글상자가 152px 뿐이라 12px 로 약 12자다. 네 줄의
                       길이 규칙은 company.ts 의 summary 주석에 있다.

                    px-3 pb-2.5 pt-8 — 영상 자막(px-5 pb-5 pt-12)보다 작다.
                    사진 높이가 99~119px 라 같은 패딩을 주면 절반을 덮는다.

                    pointer-events-none — 누를 것이 없다. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/40 to-transparent px-3 pb-2.5 pt-8">
                  <p className="text-xs font-medium leading-snug text-white">
                    {p.summary}
                  </p>
                </div>
              </div>

              {/* 카드 바닥 한 줄 — **얼마나 걸리고 무엇을 받는가.**

                  기간이 한때 위 번호 줄 오른쪽에 평문으로 서 있었다. 번호 13px
                  뒤의 빈 자리를 메우기는 했지만 "01 … 1~2일" 이 양 끝으로 멀어
                  둘이 한 정보로 읽히지 않았고, 아래 산출물과도 따로 놀았다.
                  둘은 같은 축이다 — 이 단계가 **얼마나** 걸려 **무엇을** 내놓는가.
                  그래서 한 줄로 묶었다.

                  화살표(→)를 걷었다. 카드 사이를 잇는 연결 화살표(아래 20px
                  SVG)와 같은 그림이라 "다음 단계로" 와 "이것을 받는다" 가 한
                  화면에서 같은 기호를 쓰고 있었다.

                  가로선으로 끊는다. 점 목록과 같은 결로 이어 두면 항목이 넷인
                  것처럼 읽힌다 — 이것은 목록의 일부가 아니라 그 결과다.

                  ⚠️ 기간 칩이 연한 레드다. 위 번호 주석의 "다시 원으로 돌아가지
                     말 것" 과 부딪치지 않는다 — 그 경고는 **제목과 가로로
                     경쟁하던 원형 배지**를 두고 한 말이고, 이 칩은 (1) 원이
                     아니라 rounded-md 고 (2) 가로선 아래라 제목과 경쟁하지
                     않으며 (3) bg-brand/8 로 /contact 배지(bg-brand/10)보다
                     연하다. 회색 칩 · 레드 칩 · 테두리 칩 · 세로 막대 넷을
                     그려서 고른 것이다.

                  ⚠️ rounded-full 을 쓰지 않는다. 그 생김새는 제품 상세의 분류
                     배지와 적용 분야 칩이 쓰는 것이라, 알약으로 두면 성격이
                     다른 칩이 한 사이트에서 같은 모양이 된다.

                  산출물이 한때 text-muted 회색 평문이었다. 또렷한 레드 칩 옆에
                  서니 묻혀, 카드에서 가장 나중에 읽히는 정보가 됐다. 지금은
                  체크와 font-semibold text-ink 로 받는다.

                  ⚠️ 체크는 **사이트에 이미 있는 그림**이다. 같은
                     path d="M20 6 9 17l-5-5" 를 제품 특징 카드(20px ·
                     strokeWidth 3)와 문의 완료 화면(26px)이 쓴다. 여기는 13px
                     이라 strokeWidth 를 3.2 로 올렸다 — 작은 상자에서 3 은
                     가늘다. 다른 그림으로 바꾸지 말 것.

                  ⚠️ 카드 안 레드가 셋이 된다 — 번호(12px 글자) · 기간 칩(8%
                     바탕) · 체크(13px 선). globals.css 의 "레드는 면적을 좁게"
                     를 지키는 선이다: 셋 다 점에 가깝고, 면은 칩 바탕 하나뿐이며
                     그마저 8% 다. 여기에 넷째를 더하지 말 것.

                  ⚠️ 기간과 산출물에 aria-hidden 을 주지 않는다(체크만 준다).
                     번호(ol/li 가 순서를 이미 전한다)와 달리 읽어야 뜻이
                     통하는 정보다.

                  ⚠️ 네 기간의 합이 홈 PERFORMANCE 의 "2~4주 설계 → 납품" 과
                     어긋나면 안 된다. company.ts 의 process 주석에 계산이
                     있다. 그 섹션이 바로 위라 한 화면에서 둘 다 보인다. */}
              <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
                <span className="shrink-0 rounded-md bg-brand/8 px-2 py-0.5 text-[11px] font-bold tabular-nums text-brand">
                  {p.duration}
                </span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="ml-0.5 shrink-0 text-brand"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span className="text-xs font-semibold text-ink">
                  {p.output}
                </span>
              </div>

              {/* ⚠️ 한때 여기에 카드 오른쪽 위를 덮는 56px 워터마크 번호가
                     있었다(text-[56px] font-extrabold text-brand/30). 목록 글이
                     짧아 그 자리가 비어 카드가 헐겁게 읽히던 것을 메우려던
                     것이고, 모양 넷(원형 배지 · 상단 레드 띠 · …)과 농도
                     넷(brand/18 · /30 · /45 · line/70)을 비교해 고른 값이었다.

                     걷은 이유는 그 숫자가 제목만큼 무거워 **부담스럽다**는
                     것이다 — 메우려던 문제보다 생긴 문제가 컸다. 다시 넣을
                     생각이라면 그때 비교한 넷을 또 비교하지 말고, 위 배지가
                     /contact 와 통일되어 있다는 점부터 볼 것.

                  (한때 "카드의 relative 를 걷지 말 것 — 화살표가 -right-[18px]
                  로 카드 밖에 걸쳐 있다" 가 여기 있었다. 그 화살표를 번호 줄
                  안으로 옮기면서 기준점이 필요 없어져 relative 를 걷었다.
                  다시 카드 밖에 무언가를 걸치려면 그때 되살린다.) */}

            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 6. 제품 영상 — videos.ts가 비어 있으면 통째로 렌더하지 않는다.
             여기는 맛보기 두 편만 걸고 나머지는 /videos 에서 본다. */}
      {featuredVideos.length > 0 && (
        <Section
          tone="surface"
          eyebrow="VIDEO"
          title="제품 영상"
          action={
            /* /videos 와 같은 자리에 둔다. 한쪽만 제목 줄로 올리면 같은
               성격의 두 섹션이 달라 보인다. 글자는 "전체 보기" 그대로다 —
               여기는 /videos 로 가는 내부 링크이고, /videos 쪽은 유튜브로
               나가는 "더 보기" 라 역할이 다르다. */
            <Link href="/videos" className={BTN}>
              영상 전체 보기
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          }
        >
          {/* ⚠️ 2열이 **lg(1024)** 부터다. /videos 격자(sm)와 다르고, 일부러다.

                 자막이 영상 위에 겹치므로 영상이 작아지면 자막이 영상을
                 덮는다. sm(640)에서 2열이면 카드가 264px, 영상 높이가 149px
                 뿐이어서 두 줄 자막(113px)이 **76%** 를 가렸다. lg 로 미루면
                 640 에서 1열 561px(영상 315px)이 되어 자막이 한 줄로 앉고
                 26% 만 덮는다. 폭별로 쟀다 —

                   320  1열  영상 149px  자막 2줄  63%
                   390  1열       189        2줄  50%
                   640  1열       315        1줄  26%
                   768  1열       387        1줄  21%
                  1024  2열       257        1줄  37%
                  1440  2열       297        1줄  32%

                 제품 상세 구동 영상이 같은 폭에서 24~30% 이니 결이 맞는다.
                 320.390 은 두 줄이지만 거기도 제품 상세가 74% 이므로 그보다
                 낫다. note 를 깎아 한 줄로 만들 수도 있으나 그 글은 /videos
                 카드(글상자 486px)가 함께 쓰므로 거기가 허전해진다.

                 값: 640~1023 에서 영상 두 장이 세로로 쌓여 섹션이 약 550px
                 길어진다. 그 구간에서 영상이 149 -> 315px 로 커지는 값이다. */}
          <ul className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {featuredVideos.map((v, i) => (
              <Reveal as="li" key={v.id} delay={i * 70}>
                {/* preview — 화면에 들어오면 소리 없이 자동으로 돈다.
                    /videos 쪽은 이 prop 을 주지 않아 지금처럼 버튼을 눌러야
                    재생된다. */}
                <VideoCard video={v} preview />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* 7. 주요 거래처 */}
      <Section
        eyebrow="CLIENTS"
        title="주요 거래처"
        action={
          /* 격자 아래에 있던 것을 제목 줄로 올린다. 바로 위 VIDEO 섹션이
             "영상 전체 보기" 를 같은 자리에 두는데 여기만 아래에 있어,
             같은 성격의 두 섹션이 달라 보였다. */
          <Link href="/clients" className={BTN}>
            거래처 전체 보기
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        }
      >
        <Reveal>
          <ClientGrid names={featuredClients} />
        </Reveal>
      </Section>

      {/* 8. 문의 CTA */}
      <ContactCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            alternateName: site.nameEn,
            url: site.url,
            logo: `${site.url}/images/logo.png`,
            // 유튜브 채널을 이 회사 것으로 묶어 준다(sameAs 의 용도다).
            sameAs: [site.youtube],
            foundingDate: site.founded,
            description: site.description,
            telephone: [site.tel, ...site.telExtra],
            faxNumber: site.fax,
            email: site.email,
            address: {
              "@type": "PostalAddress",
              addressCountry: "KR",
              addressRegion: "경기도",
              addressLocality: "시흥시",
              streetAddress: site.address.road,
              postalCode: site.address.postalCode,
            },
            founder: { "@type": "Person", name: site.ceo },
            makesOffer: products.map((p) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: p.name },
            })),
          }),
        }}
      />
    </>
  );
}

/** CTA 버튼용 화살표. ProductCard·NavPanel과 같은 모양으로 맞췄다. */
function ArrowRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 transition-transform group-hover:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
