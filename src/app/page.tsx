import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ContactCTA from "@/components/ContactCTA";
import ProductCard from "@/components/ProductCard";
import HeroBackgroundVideo from "@/components/HeroBackgroundVideo";
import MagneticLink from "@/components/MagneticLink";
import ParallaxLayer from "@/components/ParallaxLayer";
import ProductVideo from "@/components/ProductVideo";
import Section from "@/components/Section";
import {
  POSITIONING_GROUPS,
  POSITIONING_IDEAL,
  positioning,
  positioningMap,
} from "@/data/company";
import ClientGrid from "@/components/ClientGrid";
import Reveal from "@/components/Reveal";
import ScrollCue from "@/components/ScrollCue";
import StatCounter from "@/components/StatCounter";
import { featuredClients } from "@/data/clients";
import { performanceKpis, products } from "@/data/products";
import { site } from "@/data/site";
import VideoCard from "@/components/VideoCard";
import { featuredVideos } from "@/data/videos";

/** count=false 인 값은 세어 올리지 않는다 — 연도가 굴러가면 어색하다. */
/* 첫 화면에 서는 진동기 네 기종.

   ⚠️⚠️ **w·h 는 도면의 모델 단위 그대로다.** 넷을 같은 도면
      (유신자료/진동기,리니어도면.dwg)의 같은 줄에서 **같은 축척으로**
      잘라 왔기 때문에, 이 숫자의 비(207 : 288 : 375 : 549)가 곧 실제
      크기 비다. 화면에서 그 비율대로 서는 것이 이 블록의 전부다 —
      **보기 좋으라고 고치면 거짓이 된다.**

   ⚠️ 중량은 제품 상세 규격표(products.ts 진동기 specTable)와 같은 값이다.
      한쪽만 고치지 말 것.

   ⚠️ 규격표에는 **일곱 기종**이 있다(4호구형 · Ø440 · Ø500 포함).
      첫 화면에 세우는 것은 **표준 넷**이다. */
const VIBRATORS = [
  { no: "1호", w: 207, h: 213, src: "/images/hero/vibrator-1.svg", alt: "진동기 1호 평면도" },
  { no: "2호", w: 288, h: 302, src: "/images/hero/vibrator-2.svg", alt: "진동기 2호 신형 평면도" },
  { no: "3호", w: 375, h: 380, src: "/images/hero/vibrator-3.svg", alt: "진동기 3호 신형 평면도" },
  { no: "4호", w: 549, h: 503, src: "/images/hero/vibrator-4.svg", alt: "진동기 4호 신형 평면도" },
];

/** 네 기종 도면 폭의 합. 화면 폭을 비율로 나눌 때 분모가 된다. */
const VIBRATOR_SPAN = VIBRATORS.reduce((s, v) => s + v.w, 0);

/* 지표 띠 — **넷 다 진동기 이야기다.**

   한때 1992년 설립 · 34년 제작 경력 · 34개사 · 7종 제품이었다. 회사의
   규모와 연사를 말하던 자리인데, 이 회사의 경쟁력이 **진동기를 네 가지로
   갖춰 부품마다 골라 쓰는 것**이라 첫 화면을 그쪽으로 모았다.

   ⚠️ **「34년」과 「34개사」가 첫 화면에서 빠진 것은 알고 한 선택이다.**
      처음 오는 사람에게 〈오래된 회사〉〈거래처가 많다〉는 강한 신호다 —
      회사소개와 납품실적에는 그대로 있다. 되돌릴 거면 그 두 줄을 알고
      되돌릴 것.

   ⚠️ 값은 전부 제품 상세(products.ts 진동기 kpis)에 있는 것과 같다.
      한쪽만 고치지 말 것.

   ⚠️⚠️ **스펙이 아니라 이득을 적는다.** 한때 "4종 진동기 / 200~600mm /
      7,200회/분 / 24시간" 에 설명이 "1·2·3·4호 신형 / 적용 볼 외경 /
      최대 진동수 / 연속 가동" 이었다 — **진동기 제원표를 옮겨 적은 것**이라
      "그래서 뭐가 좋아지나" 가 없었다.

      지금은 **설명 줄이 뜻을 진다.** 첫 칸의 "한 기종으로 안 되는 부품까지"
      가 이 회사가 네 기종을 갖춘 이유 그 자체다.

   ⚠️ 값의 출처 — 넷 다 products.ts 진동기에 있다.
        4            VIBRATORS 길이(1·2·3·4호 신형)
        200~600mm    kpis "적용 볼 외경"
        7,200회/분   specTable — 1·2·3호가 7,200, 4호가 3,600 이다.
                     **기종마다 진동수가 다른 것**이 "골라 쓴다" 의 근거라
                     설명 줄이 그 말을 한다
        3가지 조정   specs "조정 요소 = 스프링 매수 · 각도 · 전압"

   ⚠️ 지어낸 수치를 넣지 말 것. 넷 다 제품 상세와 같은 값이어야 한다.

   ⚠️ count 는 숫자를 세어 올리는 효과다. 글자가 섞인 값(200~600)은 셀 수
      없어 false 다. */
const STATS = [
  {
    value: VIBRATORS.length,
    count: false,
    unit: "종 진동기",
    note: "한 기종으로 안 되는 부품까지",
  },
  { value: "200~600", count: false, unit: "mm", note: "작은 볼부터 큰 볼까지" },
  /* ⚠️ 값이 "3,600~7,200" 이던 적이 있다. 360px 에서 두 줄로 깨져 지표
        띠가 24px 자라고 히어로가 한 화면을 넘겼다. 값은 짧게 두고 **뜻은
        설명 줄이 진다** — 기종마다 진동수가 다르다는 것이 요점이다.
        (1·2·3호 7,200 · 4호 3,600 — 제품 상세 규격표에 있다.) */
  { value: 7200, count: true, unit: "회/분", note: "기종마다 다른 진동수" },
  /* ⚠️ 한때 "34년 튜닝 / 안 맞으면 다시 잡습니다" 였다. **회사 연차**라
        네 칸을 진동기로 모으기로 한 뜻과 어긋났다. 조정 요소 셋으로 바꿔
        네 칸이 한 줄기로 이어진다 —
          부품마다 고르고 → 크기 폭이 넓고 → 기종마다 다르고 → 고른 뒤에도 맞춘다
        출처는 products.ts 진동기 specs 의 "조정 요소". */
  { value: 3, count: false, unit: "가지 조정", note: "스프링 매수 · 각도 · 전압" },
];

/* "자세히 보기 / 전체 보기" 버튼. 영상자료의 "영상 더 보기" 와 같은
   모양이다. (오시는 길의 지도앱 버튼도 같은 꼴이었는데 그 블록이 걷혔다.)

   ⚠️ 글자뿐이다. 한때 오른쪽에 화살표(M5 12h14 + 화살촉)가 붙어 있었는데
      걷어 달라는 요청에 넷에서 모두 뺐다 — 테두리 상자가 이미 누를 곳임을
      말하므로 화살표는 같은 말을 두 번 하는 꼴이었다. 제품 목록 사이드바의
      "제작 문의" 버튼이 먼저 같은 처리를 받았다.

      group 과 gap-2 도 함께 걷었다. group 은 화살표의
      group-hover:translate-x-1 하나만 쓰던 것이고, gap 은 자식이 글자
      하나뿐이면 할 일이 없다.

   ⚠️ 홈 PROCESS 카드 안의 화살표는 **다른 것이다.** 거기는 "다음 단계가
      있다" 는 표식이라 그대로 둔다. */
const BTN =
  "inline-flex items-center rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-brand/40 hover:text-brand active:scale-[0.98]";

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
          화면이 낮아지면 패딩·글자·이미지가 clamp()로 같이 줄어든다.

          ⚠️⚠️ **들어가는지 재는 법** —
             hero.getBoundingClientRect().bottom <= window.innerHeight
          **높이끼리 비교하지 말 것.** 히어로 위에 헤더(81px)가 있어서
          hero.height 와 innerHeight 를 견주면 늘 들어가는 것처럼 나온다.
          2026-10-14 에 그렇게 재서 열한 크기 중 아홉이 11~65px 넘치는 것을
          놓쳤다. */}
      <section className="hero-screen relative flex flex-col overflow-hidden bg-dark">
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
        {/* ⚠️ 배경이 본문보다 느리게 흐른다(ParallaxLayer). 히어로를
               지나는 동안 겹이 12% 아래로 밀려 깊이가 생긴다.

            ⚠️ aria-hidden 은 ParallaxLayer 가 자체적으로 건다 — 여기서 또
               주지 않는다.

            ⚠️ 잘라 주는 overflow-hidden 은 바깥 section 에 이미 있다. */}
        {/* ⚠️⚠️ **영상은 히어로 전체에 깔린다. 반쪽으로 자르지 말 것.**
               2026-10-14 에 lg:left-1/2 로 잘라 "오른쪽 영상 패널" 을 만들어
               본 적이 있다. **잘린 화면으로 읽혔다** — 세로 경계가 생기고
               영상이 중간에 끊긴 것처럼 보인다. 더 큰 문제는 그 구조가
               **진동기를 오른쪽 절반(544px)에 가둬** 4호가 184px 로
               작아진 것이다. 전폭이던 때보다 작았다.

            ⚠️ 그래서 지금 구조는 **진동기가 세로에 막히고 폭에는 안 막힌다.**
               반쪽으로 돌리면 폭이 상한이 되어 다시 작아진다. */}
        <ParallaxLayer className="pointer-events-none absolute inset-0 opacity-[0.3]">
          <Image
            src="/images/hero-poster.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* ⚠️ 영상은 **첫 화면이 다 그려진 뒤에** 받는다(window load).
                 한동안 여기에 <video autoPlay preload="metadata"> 가 그대로
                 있었고, 주석에는 "metadata — 첫 화면 페인트를 안 막는다" 고
                 적혀 있었다. autoPlay 가 있으면 preload 값은 무시되고 전체를
                 받는다 — 바로 위 Image 와 같은 1.59MB 가 LCP 를 맡은
                 hero-poster.webp 와 대역을 다퉜다.

              ⚠️ 위 Image(priority)를 지우지 말 것. 영상이 오기 전과 '움직임
                 줄이기' 에서 보이는 것이 그 정지컷이다. 같은 장면이라 영상이
                 그 위에 겹쳐 돌기 시작해도 장면이 튀지 않는다.

                 그래서 **hero-poster.webp 는 hero.mp4 의 첫 프레임**이어야
                 한다. 영상만 갈고 정지컷을 두면 두 장면이 튄다.

              ⚠️⚠️ **테콘 2023-07, MAH02496 의 64~71초.** 짙은 녹색 볼 전체가
                    한 화면에 들어오고, 흰 부품이 나선 트랙 세 겹에 **간격을
                    두고 한 줄씩** 올라간다. 볼 바닥은 비어 있다.

                    2026-10 에 여기서 신아FA MAH03914 를 걷어 냈다. 그쪽은
                    볼 바닥이 부품으로 가득 차 **껴서 멈춘 것**처럼 보였고,
                    1초 간격으로 다시 뽑아 보니 움직이는 것이 부품이 아니라
                    **카메라**였다. 고르는 기준은 PERFORMANCE 쪽 주석에
                    셋으로 적어 두었다 — 같은 기준으로 고른 다른 영상이다.

              ⚠️ **같은 파일을 두 자리에 걸지 말 것.** 홈을 보는 쪽에서는
                 같은 장면이 두 번 나오는 것으로 읽힌다. 전송량 이야기는
                 PERFORMANCE 쪽 주석에 있다. */}
          <HeroBackgroundVideo
            src="/videos/hero.mp4"
            poster="/images/hero-poster.webp"
          />
        </ParallaxLayer>
        {/* 배경 3.5 — 미세한 필름 그레인.

            ⚠️ 자리가 **내용(Container) 앞**이다. 그래야 DOM 순서상 글자가
               그레인 위로 온다. ::after 로 만들면 반대가 된다.

            ⚠️ mix-blend-overlay 다. 어두운 면에서 어두운 점은 묻히고 밝은
               점만 살아 "인쇄된 면" 질감이 된다. opacity 0.08 은 히어로가
               영상·오버레이까지 네 겹이라 그 위에 얹히는 값으로 잡았다
               (문의 띠는 단색이라 더 진하게 줄 수 있다). */}
        <div
          aria-hidden="true"
          className="grain pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        />

        {/* 배경 3 — 글자가 읽히도록 덮는 네이비 오버레이.

            ⚠️ 이 한 겹이 글자 가독성을 혼자 맡는다. 지우면 영상 위에서 흰
               글자가 읽히지 않는다.

            한때 히어로에 겹이 다섯이었다 — 바닥 그라디언트, 영상, 이 오버레이,
            가장자리 비네트, 3D 도면 뒤를 눌러 주는 자리. 하위 페이지 배너는
            장식을 모두 걷어 바탕 한 장으로 세웠는데 홈만 다섯이라, 영상(제품이
            도는 모습이니 내용이다)과 이 오버레이만 남겼다. 바닥 그라디언트는
            section 의 bg-dark 과 거의 같은 색을 한 번 더 까는 것이었고,
            비네트와 도면 뒤 자리는 도면이 흰 금속이라 어두운 영상 위에서 그
            자체로 구분돼 없어도 읽힌다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-dark via-dark/75 to-transparent"
        />

        {/* 배경 3.6 — 화면 **아래쪽**을 눌러 주는 막.

            ⚠️⚠️ **진동기 선화가 이 위에 선다. 지우지 말 것.** 영상에는 밝은
               구간(흰 부품이 몰린 곳)이 있어 막이 없으면 **흰 선이 흰 바탕에
               묻힌다** — 실제로 3호·4호가 안 읽혔다. 막을 깔면 실측 16:1 이다.
               제품 영상 자막과 같은 수법이다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-dark via-dark/80 to-transparent"
        />

        {/* ⚠️ 세로 패딩이 4vh 였다. 진동기 줄을 전폭으로 내리면서 360x740
               에서 6px 넘쳤다 — 3.6vh 로 낮춰 위아래 6px 를 돌려받았다.
               ⚠️ 다시 올리기 전에 360x740 에서 재 볼 것. */}
        {/* ⚠️ **세로 한 줄이다.** 글이 위, 진동기가 아래 전폭.
               2026-10-14 에 lg:grid-cols-2 로 좌우를 갈라 봤다가 걷었다 —
               진동기가 반쪽에 갇혀 작아졌다(위 ParallaxLayer 주석 참고).
               justify-end 로 바닥에 앉혀 위가 비게 둔다. */}
        <Container className="relative flex flex-1 flex-col justify-end gap-[clamp(1rem,2.6vh,2rem)] py-[clamp(1.25rem,3.6vh,3.5rem)] lg:[@media(min-height:701px)]:pb-24">
            {/* ⚠️⚠️ **글은 조연이다.** 이 화면의 용건은 아래 진동기 넷이고,
                   글이 커지면 그만큼 진동기가 작아진다 — 세로 예산이 하나뿐
                   이기 때문이다. 2026-10-14 에 "어필이 텍스트보다 진동기가
                   훨씬 몇 배로 중요하다" 는 말을 듣고 줄였다.

                   버튼을 제목 오른쪽으로 보낸 것도 같은 이유다. 아래 한 줄을
                   통째로 차지하지 않아 **약 55px** 이 진동기로 넘어간다. */}
            <div className="flex flex-col items-start gap-[clamp(0.875rem,2.2vh,1.5rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
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
              {/* ⚠️ **배지다.** 한때 빨간 작은 글자였는데 "바뀐 게 하나도
                     없다" 는 말을 듣고 테두리 있는 캡슐로 바꿨다. 눈썹이
                     글자에서 **물건**이 되면서 첫인상이 달라진다. */}
              <p
                className="rise inline-flex items-center rounded-full border border-white/25 px-3 py-1 text-[clamp(0.5625rem,1.05vh,0.6875rem)] font-bold tracking-[0.22em] text-white/80"
                style={{ animationDelay: "60ms" }}
              >
                {site.tagline}
              </p>
              {/* ⚠️ 글자 크기가 **폰과 데스크톱이 다른 기준**이다.
                     폰은 **폭**(5.6vw), lg 부터는 **높이**(4.4vh)로 잡는다.
                     이 제목은 폰에서 4줄이라 vh 로 잡으면 844 에서 37px x 4 =
                     185px 를 먹고 히어로가 23px 넘쳤다. 폰은 세로가 아니라
                     **가로가 좁아서** 줄이 늘어나는 것이라 폭으로 재는 쪽이
                     맞는다. ⚠️ 하나로 합치지 말 것. */}
              <h1
                className="rise mt-[clamp(0.625rem,1.6vh,1rem)] text-[clamp(1.25rem,5vw,1.75rem)] font-bold leading-[1.3] tracking-tight text-white lg:text-[clamp(1.4rem,3.4vh,2.5rem)]"
                style={{ animationDelay: "140ms" }}
              >
                한 기종으로는 안 되는 부품이 있습니다
                <br />
                <span className="text-brand-light">그래서 네 기종을</span>{" "}
                {/* 좁은 칼럼에서 "갖췄 / 습니다"로 끊기지 않게 묶어 둔다 */}
                <span className="whitespace-nowrap">갖췄습니다</span>
              </h1>
              {/* ⚠️⚠️ **2026-10-14 — 첫 화면을 진동기 네 기종으로 돌렸다.**
                  전에는 "부품 자동정렬 공급기, 설계부터 튜닝까지 직접
                  만듭니다" + "볼피더·직진피더·호퍼피더를 부품 샘플에 맞춰
                  설계합니다" 로 **제품을 나열**했다. 이 회사의 경쟁력은
                  **진동기를 네 가지로 갖춰 부품마다 골라 쓰는 것**이라,
                  첫 화면이 그 말을 하게 했다.

                  ⚠️ **경쟁사를 깎는 문장을 쓰지 않는다.** "다른 회사는
                     정확도가 떨어진다" 는 확인할 수 없는 말이고 비방으로
                     읽힌다. **유신이 하는 것만** 적고 비교는 읽는 사람이
                     하게 둔다 — "한 기종으로 다 덮지 않습니다" 까지다.

                  한 문장이다. 전에는 두 문장(63자)이라 데스크톱에서도 두
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
                className="rise mt-[clamp(0.5rem,1.4vh,0.875rem)] max-w-xl text-[clamp(0.8125rem,1.6vh,1rem)] leading-relaxed text-white/75"
                style={{ animationDelay: "220ms" }}
              >
                부품과 볼 크기에 맞는 진동기를 골라 답니다. 작은 부품도 큰
                부품도 한 자리에서.
              </p>

              </div>

              {/* ⚠️ **mt 를 주지 말 것.** 바깥 묶음의 gap 이 간격을 맡는다 —
                     둘 다 주면 간격이 두 번 들어간다. */}
              <div
                className="rise flex flex-row items-center gap-4"
                style={{ animationDelay: "300ms" }}
              >
                {/* ⚠️ 사이트에서 마그네틱을 쓰는 자리는 둘뿐이다 — 여기와
                       문의 CTA 띠의 "온라인 문의하기". 효과를 아끼지 않으면
                       아무것도 중요해 보이지 않는다. */}
                <MagneticLink
                  href="/products"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-15 font-semibold text-white transition hover:bg-brand-dark active:scale-[0.98] sm:px-8"
                >
                  제품 살펴보기
                  <ArrowRight />
                </MagneticLink>
                {/* ⚠️ **상자가 아니라 글자 링크다.** 테두리 상자가 둘이면
                       서로 겨뤄 1차(레드)가 묻힌다. 밑줄과 화살표가 누를
                       곳임을 말한다. 상자로 되돌리지 말 것. */}
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1.5 px-1 py-4 text-15 font-semibold text-white/85 underline decoration-white/30 underline-offset-[6px] transition hover:text-white hover:decoration-white/70"
                >
                  견적 문의하기
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>

            {/* ⚠️ 한때 여기에 전폭 구분선이 있었다. 2026-10-14 에 걷었다 —
                "구분선 있다 보니깐 이상하다" 는 말이고, 지금은 **왼쪽 단색
                면과 오른쪽 영상 패널의 경계**가 그 몫을 한다. 되살리지 말 것. */}
            {/* 진동기 네 기종. 이 회사의 강점이 "부품에 맞는 진동기를 골라
                쓴다" 는 것이라, 첫 화면이 그 넷을 바로 보여 준다.

                ⚠️⚠️ **네 장의 크기 비율이 실제 값이다.** 같은 도면
                   (유신자료/진동기,리니어도면.dwg)의 같은 줄에서 **같은
                   축척으로** 잘라 왔고, SVG 의 width 가 곧 도면의 모델
                   단위다 — 207 : 288 : 375 : 549. 아래 flex-basis 가 그
                   숫자다. **임의로 고치면 거짓이 된다.**

                ⚠️ 바닥을 맞춘다(items-end). 가운데를 맞추면 크기 차이가
                   눈에 덜 띈다 — 넷을 나란히 세우는 이유가 그 차이다.

                ⚠️ <img> 다. 네 장을 JSX 로 펴면 DOM 이 1,200 노드 늘고
                   첫 화면이 그만큼 늦어진다(4호 하나가 522 요소다).
                   흰 선은 파일 안에 박아 두었다.

                ⚠️ **폰에서도 보인다.** 도면 한 장이던 시절에는 hidden
                   sm:flex 로 감췄다 — 문구·버튼·지표를 한 화면에 넣을 자리가
                   없어서였다. 지금은 이 넷이 첫 화면의 **용건**이라 감추면
                   폰에서 할 말이 사라진다. 선화라 가볍고(넷 합쳐 61KB ·
                   벡터) 390 에서도 한 화면에 들어간다.
                ⚠️⚠️ 가리는 기준이 **폭이 아니라 높이**다. 390x844 · 360x740 ·
                   768x1024 는 한 화면에 들어가는데 320x568 은 넘친다 —
                   이 줄이 125px 를 더하고 나머지가 503px 이라 568 을 넘는다.
                   그래서 **max-height:640px** 에서만 감춘다. sm:block 으로
                   되돌리지 말 것 — 그러면 폰에서 이 넷이 통째로 사라진다. */}
            {/* ⚠️ 칸을 꽉 쓴다. 한때 자연 폭으로 두었더니 1280 에서 넷이
                   합쳐 65+90+117+172px 로 서고 오른쪽 아래가 통째로 비었다.
                   폭을 100% 로 잡고 아래 calc 가 넷으로 나눈다. */}
            <div
              className="rise-zoom w-full [@media(max-height:640px)]:hidden"
              style={{ animationDelay: "380ms" }}
            >
              {/* ⚠️⚠️ **ul 은 전폭이다. 남는 폭을 간격이 먹는다.**

                     한때 ul 에 max-width 를 걸어 694px 로 묶었다. 그러면
                     1280 에서 **좌우로 394px 이 비고** 넷이 간격 20px 로
                     따닥 붙었다 — "공간을 더 활용하라" 는 말을 들은 자리다.

                     뒤집었다. 그림 폭 합계(--span)는 **높이 상한에서** 뽑고,
                     ul 은 100% 를 쓰며, **남는 폭 전부를 간격 셋이 나눈다.**

                     --h    가장 큰 4호의 **높이** 상한
                     --span 네 그림 **폭의 합** = --h / 0.3544
                            0.3544 = (549/1419) x (503/549)
                            1419 는 네 폭의 합(207+288+375+549)
                     li     calc(var(--span) * 그 기종 폭 / 1419)
                     gap    (100% - --span) / 3   ← 남는 폭을 셋이 나눈다

                     ⚠️ --span 에 min() 이 걸려 있다. 화면이 높고 좁으면
                        --h/0.3544 가 100% 를 넘어 **간격이 음수**가 된다.

                     ⚠️⚠️ **아래 비율 숫자를 손대면 거짓이 된다.** 넷은 같은
                        도면에서 같은 축척으로 잘라 온 것이고 그 비가 곧
                        실제 크기 비다. */}
              <ul
                className="flex w-full items-end"
                style={{
                  /* ⚠️⚠️ 이 값이 **진동기 크기를 혼자 정한다.** 전폭 구조라
                        폭에는 안 막히고 **세로가 상한**이다. 2026-10-14 에
                        26svh -> 40svh 로 올렸다 — 그 전에는 세로 200px 이
                        놀고 있는데 진동기는 184px 였다.
                        ⚠️ 올리면 히어로가 넘친다. 열한 크기에서 재서 정한
                           값이다. */
                  ["--h" as string]: "clamp(150px, 35svh, 420px)",
                  ["--span" as string]:
                    "min(calc(var(--h) / 0.3544), calc(100% - 3rem))",
                  gap: "max(0.5rem, calc((100% - var(--span)) / 3))",
                }}
              >
                {VIBRATORS.map((v) => (
                  <li
                    key={v.no}
                    className="shrink-0"
                    style={{
                      width: `calc(var(--span) * ${(v.w / VIBRATOR_SPAN).toFixed(4)})`,
                    }}
                  >
                    <img
                      src={v.src}
                      alt={v.alt}
                      width={v.w}
                      height={v.h}
                      className="h-auto w-full"
                    />
                    {/* ⚠️ 낮은 화면에서 mt 를 한 단계 더 줄인다 — 375x667
                           에서 마지막 3px 가 여기서 나왔다. */}
                    <p className="mt-2 text-center text-[clamp(0.625rem,1.2vh,0.8125rem)] font-bold text-white [@media(max-height:720px)]:mt-1">
                      {v.no}
                    </p>
                    {/* ⚠️ 한때 여기에 중량(약 3kg …)이 있었다. 2026-10-14 에
                           "약 3kg 이거는 필요 없어" 라는 말에 걷었다 —
                           세로 14px 을 진동기에 돌려주고 줄이 간결해진다.
                           **중량은 제품 상세 규격표에 그대로 있다.** */}
                  </li>
                ))}
              </ul>
            </div>

          {/* ⚠️⚠️ 이 표시는 **절대배치**라 높이를 더하지 않는다. 그래서
                 자리는 위 Container 의 **아래 여백**이 비워 둔다. 표시가
                 쓰는 높이는 글자 12 + 간격 8 + 선 32 + bottom-3 12 = 64px 라
                 **pb-24(96px)** 를 줘서 32px 를 띄운다. pb-16(64px)으로는
                 틈이 정확히 0 이 되어 1280x720 · 1024x768 에서 이름표에
                 **닿았다** — 실측으로 올린 값이다.

                 한때 그 여백 없이 걸었다가 진동기 이름표와 겹쳐 통째로
                 걷은 적이 있다(그림 아래부터 지표 띠까지 45px 인데 표시가
                 64px 를 쓴다). **여백과 짝으로만 쓴다.**

                 ⚠️ 여백은 표시가 보이는 조건과 **똑같은 조건**에 건다 —
                    sm(640px) 이상이고 높이 701px 이상. 그 밖에서는 표시가
                    !hidden 이라 여백만 남는다. */}
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

            ⚠️⚠️ 한동안 이 자리에 "이미 받는 파일이라 전송량도 늘지 않는다"
                  고 적혀 있었다. **사실이 아니었다.** Lighthouse 네트워크
                  기록을 보니 hero.mp4(1.59MB)가 **두 번** 내려와 홈 한
                  페이지에 3.2MB 가 흘렀다 — 사이트의 CSS·JS·이미지를 전부
                  합친 것(약 400KB)의 여덟 배다. 히어로와 이쪽이 동시에
                  autoPlay 로 요청해 캐시가 맞물릴 틈이 없었다.

                  그래서 아래를 ProductVideo 로 바꿨다. 화면에 닿기 400px
                  전에 받으므로 히어로가 먼저 끝난다.

            ⚠️ 2026-10 에 **히어로와 다른 파일로 갈랐다**(performance.mp4).
               그 전까지는 같은 hero.mp4 를 걸고 "히어로에서는 opacity 0.3 에
               네이비 오버레이까지 덮여 거의 안 보이니 같은 파일이어도 다른
               영상처럼 읽힌다" 고 적어 두었는데, 홈을 보는 쪽에서는 결국
               **같은 장면이 두 번** 나오는 것이었다.

               가르면 캐시가 안 듣는다 — 히어로 445KB + 이쪽 680KB 로 홈이
               842KB 한 개에서 **1125KB 두 개**가 된다(+283KB). 알고 받아들인
               값이다. 대신 두 편 다 1MB 규칙 안에 있고, 전에 쓰던 crf 35
               보다 좋은 crf 33 이다.

            1024 미만은 16/9 다 — 영상 원본과 같은 비율이라 아무 데도 잘리지
            않는다. lg 부터는 3/1 로 눕힌다. 전체 폭(1088px)에서 16/9 면
            612px 라 영상이 화면을 다 먹고 아래 KPI 가 밀려난다. 3/1 이면
            363px 이고, 제목.영상.KPI 넷이 1440x900 한 화면에 들어온다.

            object-cover 가 위아래를 자르지만 트랙이 화면을 가로지르는 장면
            이라 부품이 가운데 남는다 — 눈으로 확인했다.

            ⚠️ 정지컷(poster)과 '움직임 줄이기' 처리는 ProductVideo 가
               맡는다 — 그쪽 머리 주석에 적혀 있다. */}
        {/* ⚠️ 제품 상세의 "구동 영상" 과 **같은 컴포넌트**다. 비율
               (16/9, lg 3/1) · 받침색 · 정지컷 · 자막 그라데이션이 원래부터
               한 글자도 다르지 않았고, 여기 있던 40행이 그 복사본이었다.

            ⚠️ 정지컷의 alt 가 "" 가 된다. 전에는 "커넥터 부품을 정렬해
               트랙으로 내보내는 볼피더" 였는데, 바로 아래 자막이 같은 사실을
               글로 말하므로 스크린리더가 두 번 읽었다. 장식 이미지가 맞다.

            ⚠️ note 가 자막이다. 제목("쏟아 넣으면 한 줄로 나옵니다")이
               비유라면 이쪽은 장면 그대로를 말한다. */}
        {/* ⚠️⚠️ **아하테크 2020-04, MAH03965 의 8~15초.**

                 ⚠️⚠️ 장면을 고르는 기준이 2026-10 에 뒤집혔다. 그 전에는
                       "부품이 많이 보이는 쪽" 을 골랐고, 직전까지 걸려 있던
                       신아FA MAH03914(5~12초)는 볼 바닥이 금속 부싱으로
                       **가득 차** 있었다. 주석에는 그것을 "가득 차고 한 줄로
                       올라간다 — 제목 그대로다" 라고 적어 두었는데, 정작
                       화면에서는 **부품이 껴서 멈춘 것**으로 읽혔다. 게다가
                       그 구간은 부품이 아니라 **카메라가** 움직였다.

                 그래서 기준이 셋이 됐다 — (1) 볼 바닥이 **보일 만큼만** 깔릴
                 것, (2) 트랙 위 부품이 **간격을 두고 한 줄**일 것, (3) 1초
                 간격 연속 프레임에서 **부품 자리가 눈에 띄게 옮겨갈** 것.
                 8초 간격 프레임만 보면 (3)을 못 잡는다 — 후보마다 1초 간격
                 으로 다시 뽑아 눈으로 가렸다.

            ⚠️ 하단 22% 띠 Y 평균 107.3(최대 111.5). 기존 제품 영상 일곱 편이
               66~115 이니 그 안이고, dark/85 를 덮으면 흰 글자 대비가
               **15.0:1** 이라 AAA(7:1)의 두 배다. (2026-10-14 에 막 색을
               여러 번 바꿔 가며 쟀고, 거쳐 온 넷 중 지금이 가장 높다.) */}
        <ProductVideo
          video={{
            src: "/videos/performance.mp4",
            poster: "/images/performance-poster.webp",
            note: "트랙에 올라선 부싱이 간격을 지키며 한 줄로 빠져나갑니다.",
          }}
        />

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
              <p className="text-34 font-extrabold leading-none tracking-tight tabular-nums text-ink">
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
      {/* ⚠️ 회색 면이 위 흰 섹션 **위로 얹힌다**(-mt + 둥근 위 모서리).
             색이 번갈아 서기만 하던 경계에 겹이 생긴다. VIDEO 섹션도 같은
             값을 쓴다 — 회색 면 둘이 같은 규칙이어야 우연으로 안 보인다.

          ⚠️ 끌어올린 만큼 위 섹션의 아래 여백이 가려진다. 폭 일곱 종에서
             잰 값 —

               폭      -mt    반경   위 내용과의 거리
               ~639    32px   32px   24px (제품 라인업) / 58px (제품 영상)
               640~    48px   40px   40px              / 74px

             어느 폭에서도 위 섹션 내용에 닿지 않는다. Section 의 pb 를
             줄이면 이 거리를 다시 잴 것.

          ⚠️ 반경은 -mt 를 넘지 않게 둔다. 지금은 좁은 폭에서 32 = 32 로
             같고 sm 부터 40 < 48 이다. 반경이 더 커도 잘리지는 않지만,
             둥근 부분이 겹침 영역을 넘어 위 섹션 안쪽까지 올라간다. */}
      <Section
        className="-mt-8 rounded-t-[2rem] sm:-mt-12 sm:rounded-t-[2.5rem]"
        tone="surface"
        eyebrow="PRODUCTS"
        title="제품 라인업"
        action={
          /* VIDEO.CLIENTS.PROCESS 와 같은 자리.같은 꼴이다. */
          <Link href="/products" className={BTN}>
            제품 전체 보기
          </Link>
        }
      >
        {/* 셋만 건다. 일곱 개를 다 늘어놓으면 3+3+1 로 끊겨 마지막 줄에 한
            칸만 남고, 홈에서 제품을 "훑어보는" 자리가 제품 목록 페이지와
            같아진다. 앞 셋은 배열 순서 그대로다 — 볼피더가 본체, 직진피더가
            이송, 진동기가 구동부로 피더 한 벌의 뼈대다. */}
        {/* ⚠️ **균등 3등분이다**(lg:grid-cols-3). 모든 폭에서 세 칸이
               같은 폭.같은 높이다.

            ⚠️⚠️ 한 라운드 동안 **첫 칸이 넓었다**(1.2fr : 1fr : 1fr) —
                  "볼피더가 본체, 직진피더가 이송, 진동기가 구동부" 라는
                  위계를 격자 폭으로 읽히게 하려던 것이었다. 화면을 보고
                  **되돌렸다**: 같은 종류의 카드 셋에서 하나만 크면 위계가
                  아니라 **크기가 틀린 것**으로 읽힌다. 세 제품은 모두
                  "제품 라인업" 의 동급 항목이고, 순서(볼피더가 첫째)만으로
                  이미 주력을 말한다.

                  다시 비대칭으로 돌리지 말 것. 돌리려면 폭 일곱 종에서
                  카드 높이를 다시 재고, 아래 items-start 도 함께 되살려야
                  한다 — 그 둘은 한 쌍이다.

            ⚠️⚠️ **lg:items-start 를 걷었다(기본 stretch).** 그것은 첫 칸이
                  넓던 때 필요했던 장치다 — 사진 칸이 aspect-[4/3] 이라
                  폭이 넓어지면 높이도 커지고, stretch 면 세 카드가 가장
                  큰 카드 높이로 맞춰져 사진이 작은 둘에 49px 흰 자리가
                  남았다. **폭이 같아지면 사진 높이도 같아져 그 전제가
                  사라진다.**

            ⚠️ 그래서 ProductCard 의 h-full 이 **이제 여기서도 일을 한다** —
               stretch 가 세 카드를 가장 긴 글에 맞춰 늘리고, h-full 이
               카드를 그 높이까지 채운다. /products 와 상세 "다른 제품" 의
               균등 격자와 같은 방식이 됐다. 지우지 말 것.

            ⚠️ sm(2열)과 그 아래(1열)는 전부터 균등이었다 — 변화 없다. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((product, i) => (
            <Reveal key={product.slug} delay={i * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 5. 포지셔닝 — 유신이 어디에 서 있는가

          ⚠️⚠️ **한때 여기가 PROCESS(문의부터 납품까지) 4카드였다.** "모든
                피더회사가 이 프로세스라 특별한 게 없다" 는 말에 걷었다.
                맞는 지적이다 — 접수 → 설계 → 가공 → 납품은 업계 공통이라
                그 자리에 두면 홈에서 **구별이 되는 자리 하나를 공통 정보에
                내준다.**

                도입 프로세스 자체는 /contact 에 그대로 있다(company.ts 의
                process 를 거기서 쓴다). 정보가 사라진 것이 아니라 자리를
                옮긴 것이다.

          ⚠️ **홈에 숫자를 쓰는 자리가 둘이 됐다.** 위 PERFORMANCE 띠(99% ·
             7,200회/분 · 24시간 · 2~4주)와 여기다. 역할이 갈린다 —
               PERFORMANCE   **제품**이 무엇을 하는가   4열 가로 · 가운데 정렬 ·
                                                       세로선 · 큰 숫자
               WHY YUSIN     **회사**가 어디에 서 있나   표 + 2축 맵
             생김새를 비슷하게 만들지 말 것. 큰 숫자를 4열로 늘어놓는 순간
             같은 섹션이 둘이 된다.

          ⚠️⚠️⚠️ **경쟁군 두 열의 값은 유신 측 검수를 받아야 한다.** company.ts
                   의 positioning 주석에 까닭과 지켜야 할 규칙 둘을 적어 뒀다
                   (회사 이름을 쓰지 않는다 · 수치는 유신 열에만). */}
      <Section
        /* ⚠️ 전에는 eyebrow "POSITIONING" · title "유신이 있는 자리" 였다.
              "유신을 선택하는 이유 이런 느낌으로" 라는 말에 바꿨다 — 앞은
              우리가 어디 서 있는지를 **우리 말로** 한 것이고, 지금은 고객이
              묻는 것("왜 여기냐")에 답하는 말이다. 아래 비교표가 그 이유를
              다섯 줄로 하나씩 답하는 구조가 된다.

           ⚠️ lead 를 두지 않는다. 바로 아래 표가 그 자체로 설명이라, 한 줄을
              끼우면 같은 말을 두 번 하면서 표까지 시선이 닿는 거리도 멀어진다. */
        eyebrow="WHY YUSIN"
        title="유신을 선택하는 이유"
        action={
          /* PROCESS 때부터 있던 버튼이다. 그때 근거는 "제작 과정을 읽은 다음이
             문의로 가기 자연스러운 자리" 였는데, 지금은 **비교표로 믿음을 준
             다음**이라 더 맞는다.

             글자가 "견적 문의하기" 가 아닌 것은 히어로 버튼이 이미 그 말을
             쓰고 있어서다. 한 페이지에 같은 글자 버튼이 둘이면 눌러 본 것을
             또 누르게 된다.

             ⚠️ /company 로 바꾸지 말 것. 홈 본문에 회사소개 링크를 **일부러
                두지 않았다** — 위 PERFORMANCE 주석에 "그 동선은 헤더.푸터
                메뉴에 있다" 고 적혀 있다. */
          <Link href="/contact" className={BTN}>
            제작 문의하기
          </Link>
        }
      >
        {/* 표 + 맵이 **한 줄**로 선다.

            ⚠️⚠️ **xl(1280) 부터다. lg(1024)가 아니다.** 1024 는 Container 가
                  945px 뿐이라 좌우로 쪼개면 표가 550px 가 되는데, 네 열에
                  가장 긴 값("전담 부서 · 현장 방문", 13px 로 약 150px)을
                  담으려면 630px 는 있어야 한다. 1280(Container 1088)에서
                  표가 1.35fr 를 받아 약 620px 다 — 거기서 겨우 선다.
                  이 비율을 바꾸면 1280 에서 네 열이 줄바꿈되는지 다시 잴 것.

            ⚠️ items-start 다. 표(약 300px)와 맵(약 390px)의 높이가 달라
               stretch 로 두면 짧은 쪽이 늘어나 표 행 사이가 벌어진다. */}
        {/* ⚠️⚠️ **items-start 를 쓰지 않는다**(기본 stretch). 오른쪽 맵 칸이
                  왼쪽 표와 같은 높이를 받아야 하기 때문이다 — 한때
                  xl:items-start 라 표 297px 옆에 맵 칸이 395px 로 서서
                  "그래프가 표보다 훨씬 커 보인다" 는 말을 들었다.
                  맵 안쪽에서 flex-1 이 그 높이를 나눠 쓴다. */}
        <div className="grid gap-10 xl:grid-cols-[1.35fr_1fr] xl:gap-12">
          {/* ── 비교표 ──

              ⚠️⚠️ **회사 개요 표(/company OVERVIEW) · 오시는 길 연락처 표와
                    같은 결이다** — 선뿐이고 바탕색이 없다. 한 라운드 동안
                    유신 열에 bg-surface 회색 띠를 깔았는데, "크게 강조된다는
                    느낌이 안 든다" 는 말을 들었다. 맞는 지적이다. 회색
                    배경은 강조 수단 가운데 **가장 약하고**, 폼의 비활성
                    칸에서도 쓰는 색이라 "꺼진 열" 로도 읽힌다.

                    지금은 셋을 겹쳐 쓴다 —
                      크기   유신 15px   /  나머지 14px
                      굵기   bold       /  보통
                      색     ink        /  muted
                    여기에 머리 칸 아래 **brand 밑줄 2px** 하나를 더한다.
                    크기 차이가 가장 세게 먹는다.

              ⚠️ brand 는 그 밑줄에만 쓴다. 사이트 규칙이 "레드는 면적을
                 좁게 — CTA · 라벨 · **강조선**에만" 이라 선은 되고 배경은
                 안 된다. 유신 열에 연한 레드를 깔고 싶어질 때 이 줄을 볼 것.

              ⚠️ 모든 칸이 가운데 정렬이다(첫 열 포함). 항목 글자가
                 "가격대"~"부품 변경" 으로 짧아 가운데가 어색하지 않다.

              ⚠️ 가로 스크롤 + 오른쪽 페이드 마스크는 **제품 상세 사양표가
                 쓰는 것과 같은 장치**다. min-w-[34rem]은 네 열이 줄바꿈
                 없이 서는 최소 폭이다(가운데 정렬이라 패딩이 줄어 36 -> 34rem).

              ⚠️ th scope 가 둘이다 — 머리행은 col, 각 행의 항목 이름은 row. */}
          {/* ⚠️ div 가 아니라 **Reveal** 이다. 래퍼를 덧대지 않고 격자 자식
                 자체를 바꾼 것 — Reveal 이 className 을 그대로 받으므로 격자
                 칸이 안 바뀐다. 래퍼를 하나 더 두면 grid 자식이 그 래퍼가 되어
                 overflow-x-auto 가 칸 밖으로 밀린다. */}
          <Reveal className="overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-36px),transparent)] sm:[mask-image:none]">
            {/* ⚠️⚠️ **border-separate 다(collapse 가 아니다).** 유신 열을
                      세로 띠로 감싸는데, collapse 에서는 **셀의 border-radius 가
                      렌더되지 않아** 띠의 위아래 모서리를 둥글릴 수 없다.

                      ⚠️⚠️ separate 에서는 **tr 의 border 가 렌더되지 않는다.**
                            그래서 행 선을 전부 **각 셀(th · td)** 로 옮겼다.
                            collapse 로 되돌리려면 그 선들을 다시 tr 로 모아야
                            한다 — 안 그러면 선이 두 겹으로 보인다.

                      border-spacing-0 이라 보기에는 collapse 와 거의 같다.
                      세로선이 없고 가로선은 행마다 하나뿐이라 겹칠 일도 없다. */}
            <table className="w-full min-w-[34rem] border-separate border-spacing-0 text-center text-sm">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="whitespace-nowrap border-b border-line px-3 py-3 text-13 font-bold text-muted"
                  >
                    항목
                  </th>
                  {POSITIONING_GROUPS.map((group, i) => (
                    <th
                      key={group}
                      scope="col"
                      /* ⚠️ 유신 열(i === 0)에서 **세로 띠가 시작된다** —
                           bg-brand/[0.06] 과 위쪽 모서리만 둥근 rounded-t-lg.
                           띠는 아래 tbody 의 같은 열로 끊김 없이 이어진다. */
                      className={`whitespace-nowrap border-b border-line px-3 py-3 text-13 font-bold text-muted ${
                        i === 0 ? "rounded-t-lg bg-brand/[0.06]" : ""
                      }`}
                    >
                      {/* ⚠️⚠️ 첫 열(유신)은 **글자가 아니라 YUSIN 로고**다.
                                맵 점 라벨과 같은 파일(logo-mark.webp)을 쓴다.

                            ⚠️ 한때 여기에 brand 밑줄 2px 가 있었다. 로고가
                               들어오고 아래 값이 네이비가 되면서 **밑줄 없이도
                               열이 구분돼** 걷었다 — 빨간 선까지 있으면 한 열에
                               강조가 셋이 된다.

                            ⚠️ scope="col" 을 지우지 말 것. 스크린리더가 각 칸을
                               "유신 F.A / 사내 21종 55대" 로 읽는 근거다.
                               로고의 alt 가 그 이름을 전한다.

                            ⚠️ 높이가 h-4(16px)다 — 머리행 글자가 13px 라 그에
                               맞췄다. 맵 점 라벨은 h-3.5 로 한 단계 작다. */}
                      {i === 0 ? (
                        <Image
                          src="/images/logo-mark.webp"
                          alt={group}
                          width={129}
                          height={32}
                          className="mx-auto h-4 w-auto"
                        />
                      ) : (
                        group
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              {/* ⚠️ 마지막 행에서 **띠의 아래 모서리**를 둥글린다.
                     nth-child(2)가 유신 열이다 — 첫 셀은 th scope="row"(항목
                     열)이므로 2번째다. **열 순서를 바꾸면 이 선택자도 함께 볼 것.**

                  ⚠️ 아래 tr 에 border 를 주지 말 것 — border-separate 에서는
                     렌더되지 않는다(위 table 주석 참고). 선은 각 셀이 그린다.

                  ⚠️⚠️ map 의 화살표 함수가 여는 괄호 **바로 뒤에 JSX 주석을
                        두지 말 것.** 자식이 둘이 되어 "Expected '</', got
                        'ident'" 로 빌드가 깨진다 — 이 주석을 거기 뒀다가
                        겪었다. 설명은 이렇게 바깥으로 모은다. */}
              <tbody className="[&>tr:last-child>td:nth-child(2)]:rounded-b-lg">
                {positioning.map((row) => (
                  <tr key={row.item}>
                    <th
                      scope="row"
                      className="whitespace-nowrap border-b border-line px-3 py-3.5 text-13 font-bold text-muted"
                    >
                      {row.item}
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={POSITIONING_GROUPS[i]}
                        /* ⚠️⚠️⚠️ **유신 열 값은 검정(ink)이다. 포인트 색을 주지
                                    말 것.** 이 색을 네 번 바꿔 **처음으로
                                    돌아왔다** —

                                      1) ink(검정)   처음
                                      2) 차콜        "회색 배경은 강조가 약하다"
                                                     는 지적에 색을 더했다
                                      3) brand(빨강)  "로고와 이상적이 빨강인데
                                                     값만 네이비라 포인트가 둘"
                                      4) ink(검정)    "빨간색 포인트 주니깐
                                                     이상하다. 검정이 낫다"
                                      5) **ink-soft(진회색)** 지금. "검정보다
                                                     항목 글자색이 나아 보인다"

                                    ⚠️⚠️ 5번에서 지목받은 "항목" 열은 사실
                                          **text-muted(#6b7280)** 인데, 그 색은
                                          **수입.저가 열의 값과 똑같다.** 그대로
                                          쓰면 세 열의 값이 전부 같은 색이 되어
                                          색으로 주던 강조가 사라진다. 그래서
                                          **사이 단계인 ink-soft(#414751)** 로
                                          갔다 — 검정보다 연해 "덜 튀는" 느낌이면서
                                          다른 두 열보다는 진하다.

                                    ⚠️ 2.3번(네이비.빨강)은 **색을 더 세게** 준
                                       시도였고 둘 다 되돌렸다. 이 섹션에 이미
                                       레드가 넷이기 때문이다 — 맵의 점 · YUSIN
                                       로고 · "이상적" 글자 · 영역 음영. 표까지
                                       강한 색을 쓰면 어디를 봐야 할지 흩어진다.
                                       **색은 한 단계 낮추는 쪽으로만 움직일 것.**

                           ⚠️ 강조는 **크기(15 vs 14) · 굵기(700 vs 400) · 색
                              (ink-soft vs muted) · 머리의 YUSIN 로고** 넷이
                              나눠 맡는다. 색 하나에만 기대지 않는다.

                           ⚠️ ink-soft 는 사이트가 **이미 쓰는 색**이다 —
                              /location 연락처 표의 값, 지도 플레이스홀더 글자가
                              그것이다. 새 색을 만든 것이 아니다. */
                        /* ⚠️⚠️ 유신 열(i === 0)이 **세로 띠**다. 머리행 th 에서
                                 시작해 여기를 지나 마지막 행에서 아래 모서리가
                                 둥글어진다(tbody 의 arbitrary variant).

                                 ⚠️ 한 라운드 동안 **행마다 칩 다섯 개**였다.
                                    "열 형태로 감싸고 싶었다, 행 말고" 라는 말에
                                    띠로 바꿨다. 칩으로 되돌리지 말 것 — 행 칩은
                                    다섯 덩어리로 끊겨 보이고, 열 띠는 하나로
                                    이어져 "이 열이 우리" 가 한눈에 읽힌다.

                                 ⚠️ 배경이 bg-brand/[0.06] 이다. 맵의 "이상적"
                                    영역과 **똑같은 톤**이라 섹션 안에서 "유신" 을
                                    가리키는 색이 표와 맵에서 하나로 묶인다.
                                    **글자색으로는 빨강을 두 번 되돌렸지만
                                    배경은 다르다** — 그때 문제는 글자가 튀는
                                    것이었고 6% 배경은 훨씬 은은하다.

                           ⚠️ border-b 가 **셀에** 있다. border-separate 라 tr
                              에 주면 렌더되지 않는다(위 table 주석 참고). */
                        className={`whitespace-nowrap border-b border-line px-3 py-3.5 ${
                          i === 0
                            ? "bg-brand/[0.06] text-15 font-bold text-ink-soft"
                            : "text-muted"
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          {/* ── 2축 맵 ──

              ⚠️⚠️ **"이상적" 영역이 이 그림의 전부다.** 한 라운드 동안 점
                    셋과 십자 축선뿐이었는데 "뭐가 뭔지 모르겠다 · 시각적으로
                    좋다는 게 안 느껴진다" 는 말을 들었다. 점만 흩어 놓으면
                    **어디가 좋은 자리인지**를 그림이 말하지 않는다.

                    왼쪽 위(싸고 사내에서 다 되는 쪽)를 brand 4% 로 칠하고
                    "이상적" 이라 쓰면, 유신 점이 그 안에 들어가고 나머지
                    둘은 밖에 남는 것이 한눈에 보인다.

              ⚠️ **십자 축선을 걷었다.** 사분면을 나누는 선과 영역 음영이
                 겹치면 둘 다 흐려진다. 축 방향은 아래위 글자가 말한다.

              ⚠️ 영역 크기는 company.ts 의 POSITIONING_IDEAL 에 있다. 점
                 좌표와 함께 봐야 하므로 한 곳에 뒀다. */}
          {/* ⚠️⚠️ **카드가 맵 영역에만 붙는다.** 축 둘(대응 · 가격)과 그래프가
                    한 덩어리로 읽혀야 한다 — 그것이 "통일감" 으로 요청받은
                    범위다. 왼쪽 표는 **카드 밖**에 선뿐인 목록으로 남는다.

                    한 라운드 동안 표까지 감싸는 큰 카드였는데, 그러면 묶이는
                    것이 "섹션 전체" 라 축과 맵이 여전히 따로 놀았다.
                    **다시 바깥으로 넓히지 말 것.**

               ⚠️ 카드 클래스를 **Reveal 자체에** 붙인다. 래퍼 div 를 덧대면
                  격자 자식이 그 래퍼가 되어 "맵이 표 높이를 따라가는"
                  stretch 가 깨진다.

               ⚠️ shadow-card 다(테두리가 아니다). 홈의 카드 언어가 그것이다 —
                  ProductCard · VideoCard 가 둘 다 rounded-2xl bg-white
                  shadow-card.

               ⚠️ delay={90} — 왼쪽 표(0) 다음에 올라온다. 좌우 배치라 읽는
                  방향과 같고, 위아래로 떨어지는 폭에서도 표가 먼저다. */}
          <Reveal
            delay={90}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-card sm:p-6"
          >
            {/* 세로축 · 맵 · 가로축을 **한 격자**에 넣는다.

                ⚠️⚠️ **가로축이 맵과 같은 격자 열(2열)에 있어야 한다.** 한때
                      가로축 줄이 오른쪽 칸 **전체 폭**(세로축 + 간격 + 맵)에
                      걸쳐 있어 왼쪽 화살표가 **맵 박스 바깥**에서 시작했다 —
                      "저렴이 네모 그래프 밖으로 나가서 보기 어렵다" 는 말을
                      들은 자리다. 격자로 묶으면 좌우 끝이 1px 도 어긋날 수 없다.

                      w-10 같은 폭을 세로축과 가로축 자리에 **따로 적는 방식을
                      쓰지 말 것** — 한쪽만 고치면 다시 어긋난다. 폭은 아래
                      grid-cols 한 곳에서만 정해진다.

                ⚠️ flex-1 이다. 바깥 격자가 stretch 라 이 칸이 왼쪽 표와 같은
                   높이를 받고, 그 높이를 세로축.맵(1fr)과 가로축(auto)이
                   나눠 쓴다. 표가 길어지든 짧아지든 맵이 저절로 따라온다. */}
            <div className="grid flex-1 grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-3">
              {/* 세로축 — 화살표 ↑ / 칩 / 화살표 ↓

                  ⚠️⚠️ **칩이 세로로 선다**([writing-mode:vertical-rl] —
                        글자가 똑바로 선 채 위에서 아래로 읽힌다). 가로로 두면
                        "현장 대응" 이 좁은 칸에서 두 줄로 깨지고, 칸을
                        넓히면 맵이 그만큼 좁아진다. 세로로 세우면 칸이
                        40px 면 충분하고 **글자 수 제약도 사라진다.**
                        (지금은 2글자라 짧지만, 길어져도 칸을 안 넓혀도 된다.)

                  ⚠️⚠️ **rotate-180 을 더하지 말 것.** 라틴 문자를 아래에서
                        위로 읽히게 하는 흔한 트릭인데, 한글은 vertical-rl
                        에서 이미 **똑바로 선다.** 거기에 180도를 더하면
                        "현장 대응" 이 "응대 장현" 처럼 **글자가 거꾸로 뒤집힌다**
                        — 한 번 그렇게 넣었다가 화면에서 잡았다.

                  ⚠️ 글자(넓음 / 좁음)를 다시 넣지 말 것. 화살표만으로 방향이
                     읽히고, 글자를 더하면 축이 다시 복잡해진다 — 걷어 달라는
                     요청으로 지운 것이다.

                  ⚠️ justify-between 이라 맵 높이가 바뀌어도 위.가운데.아래가
                     저절로 벌어진다. 고정 간격을 주지 말 것. */}
              {/* ⚠️ 패딩을 주지 말 것. py-1 이 있던 동안 세로축 화살표가
                     맵 위아래 끝보다 **4px 안쪽**에 섰다 — 가로축은 0px 라
                     둘이 어긋났다. 실측해서 걷었다. */}
              {/* ⚠️⚠️ **justify-center + gap 이다. justify-between 이 아니다.**
                        between 이면 화살표가 맵 양 끝에 0px 로 딱 붙는데,
                        그러면 칩에서 너무 멀어 축 하나로 안 읽힌다. 가운데로
                        모으되 칩에 밀착시키지도 않는다.

                        ⚠️ gap 값은 **가로축과 같아야 한다**(지금 둘 다 gap-8).
                           한쪽만 고치면 두 축이 짝으로 안 보인다. */}
              {/* ⚠️⚠️⚠️ **화살표까지 한 알약 안에 있다.** 알약이 글자만 감싸고
                           화살표가 밖에 따로 서 있던 때가 있는데, "화살표하고
                           대응 / 가격이 서로 독립된 느낌" 이라는 말을 들었다.
                           바탕을 축 전체에 깔면 **한 덩어리**가 된다.

                  ⚠️⚠️ **아래 가로축과 구성이 똑같아야 한다** — 패딩 + 화살표 +
                        gap + 두 글자 + gap + 화살표. 그래야 두 축의 **길이가
                        저절로 같아진다.**

                  ⚠️⚠️⚠️ **알약이 칸 전체로 늘어나는 것이 의도다.** 격자 자식의
                           기본값 stretch 를 그대로 쓴다 —

                             세로축  열 auto(내용 두께) · 행 1fr  -> **맵 높이**
                             가로축  열 1fr             · 행 auto -> **맵 폭**

                           그래서 알약 길이를 숫자로 적을 일이 없고, 맵이 폭마다
                           달라져도 저절로 따라온다.

                           ⚠️ **place-self-center 를 다시 넣지 말 것.** 한 라운드
                              동안 그게 있었다. 그때는 화살표가 알약 **밖**에
                              따로 서 있어서 알약이 글자만 감쌌고, 칸만큼 늘어나면
                              안이 휑해 **버그**였다. 화살표를 알약 안으로 넣은
                              지금은 길수록 좋다 — "그래프 가로.세로 길이와
                              동일하게 맞춰 달라" 는 요청이 그것이다.

                  ⚠️ 안쪽은 **justify-between** 이다. 알약이 길어졌으므로
                     justify-center + gap 으로는 내용이 가운데 뭉친다. 양 끝으로
                     벌리고, 패딩(20px)이 화살표를 알약 끝에서 띄운다 — 알약
                     두께가 28px 라 반경이 14px 이므로 둥근 모서리 **바깥**에
                     화살표가 선다.

                        한때 알약 둘의 **비율만** 1.86 : 1 로 맞췄는데, 길이가
                        66 vs 52 로 달라 "대응이 더 길어 보인다" 는 말을 들었다.
                        비율이 아니라 **길이와 두께**를 맞춰야 한다.

                  ⚠️⚠️ **leading-none 이 두께를 맞춘다.** 그것 없이는 세로쓰기
                        글자의 가로 두께(line-height 기준 약 26px)가 가로축
                        글자의 높이(18px)보다 커서 세로축만 두꺼워진다.
                        주면 둘 다 화살표 16px 가 두께를 정한다.

                  ⚠️⚠️ **px 와 py 가 뒤바뀐 것처럼 보이는데 맞다.** Tailwind v4 의
                        px-* 와 py-* 는 **논리 속성**(padding-inline /
                        padding-block)이라, writing-mode:vertical-rl 에서는 글이
                        흐르는 방향이 세로가 되어 둘의 뜻이 90도 돌아간다 —

                          py-4    화면에서 **위아래** 패딩 (알약을 길게)
                          px-1.5  화면에서 **좌우** 패딩 (알약을 얇게)

                        한 번 반대로 넣었다가 알약이 **가로로 누운** 것을 화면에서
                        잡았다. 값을 고칠 때 이 뒤바뀜을 먼저 떠올릴 것.

                        ⚠️ 바깥 div 는 writing-mode 가 없으므로 **거기 쓰는
                           px/py 는 평범하게 동작한다.** 뒤바뀌는 것은
                           writing-mode 가 걸린 span 뿐이다. */}
              <div className="flex flex-col items-center justify-between rounded-full bg-surface px-1.5 py-5">
                <AxisArrow className="rotate-[-90deg]" />
                <span className="text-13 font-bold leading-none text-ink-soft [writing-mode:vertical-rl]">
                  대응
                </span>
                <AxisArrow className="rotate-90" />
              </div>

              {/* ⚠️⚠️ 비율이 **세 구간**이다. 맵이 xl 부터는 표 옆에 서서
                        **표 높이를 따라가고**(aspect 를 푼다), 그 아래에서는
                        전폭이라 비율이 높이를 정한다 —

                          ~640   4/3    점 셋이 세로로 흩어진다
                          640~   5/2    전폭이라 납작해야 한다
                          1280~  auto   표 높이에 맞춘다

                        한때 전 폭 4/3 이었는데 1024 에서 960 x 720px 짜리
                        거대한 상자가 됐다. 중간 구간을 빼먹으면 그 꼴이 된다. */}
              {/* ⚠️ **테두리가 없고 반경이 한 단계 작다**(xl 12px). 이 칸을
                     감싸는 카드(위 Reveal)가 있으므로 상자가 둘이면 겹쳐
                     보인다 — bg-surface 회색만으로 흰 카드 안에서 충분히
                     구분된다. 중첩된 상자의 반경을 같게 두면 바깥.안쪽
                     모서리가 평행해 어색하다(경영이념 패널이 같은 규칙을 쓴다).

                  ⚠️ 축 알약도 같은 bg-surface 다. 맵과 축이 **같은 회색**이라
                     카드 안에서 한 덩어리로 읽힌다 — 색을 가르지 말 것. */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface sm:aspect-[5/2] xl:aspect-auto">
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 bg-brand/[0.06]"
                  style={{
                    width: `${POSITIONING_IDEAL.width}%`,
                    height: `${POSITIONING_IDEAL.height}%`,
                  }}
                />
                {/* ⚠️⚠️ **brand-dark 다. brand 도, 불투명도를 준 것도 안 된다.**
                        이 글자는 영역 음영(brand 6% on surface = #f4eaec) 위에
                        올라가므로 흰 바탕일 때보다 대비가 낮다. 실측 —

                          text-brand/70   #de615c   2.98:1   X  (Lighthouse 가 잡음)
                          text-brand      #d5261e   4.37:1   X  아슬하게 미달
                          text-brand-dark #b41f18   5.70:1   O

                        12px bold 라 WCAG 의 "큰 글자" 예외(3:1)도 못 받는다.
                        영역 음영을 진하게 바꾸면 이 값을 다시 잴 것. */}
                <span className="absolute left-4 top-3.5 text-xs font-bold text-brand-dark">
                  이상적
                </span>

                {positioningMap.map((point) => (
                  <div
                    key={point.label}
                    className="absolute -translate-x-1/2 translate-y-1/2 text-center"
                    style={{ left: `${point.x}%`, bottom: `${point.y}%` }}
                  >
                    {/* ⚠️ 유신만 레드이고 한 단계 크다. ring 은 점을 키우지
                           않고 무게만 더한다. */}
                    <span
                      aria-hidden="true"
                      className={`mx-auto block rounded-full ${
                        point.self
                          ? "h-3.5 w-3.5 bg-brand ring-4 ring-brand/15"
                          : "h-2.5 w-2.5 bg-muted"
                      }`}
                    />
                    {/* ⚠️⚠️ 유신만 **로고**다(logo-mark.webp — 빨강 YUSIN
                              워드마크, 129x32). 글자로 "유신 F.A" 라고 쓰면
                              옆 둘과 같은 무게인데, 로고는 그것 하나로
                              "우리" 라고 말한다.

                          ⚠️ alt 를 비우지 말 것. 점 라벨이라 이름이 읽혀야
                             한다 — 장식이 아니다. */}
                    {point.self ? (
                      <Image
                        src="/images/logo-mark.webp"
                        alt={point.label}
                        width={129}
                        height={32}
                        className="mx-auto mt-2 h-3.5 w-auto"
                      />
                    ) : (
                      <span className="mt-2 block whitespace-nowrap text-xs text-muted">
                        {point.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 1열 2행 — 세로축 아래의 빈 자리. 가로축을 맵과 같은 열에
                  두기 위한 것이다(위 격자 주석 참고). */}
              <div aria-hidden="true" />

              {/* 가로축. **위 세로축과 구성이 똑같다** — 패딩 + 화살표 + gap +
                  두 글자 + gap + 화살표. 한쪽만 고치면 두 축의 길이가 어긋나
                  "하나가 더 길어 보인다" 는 말이 다시 나온다.

                  ⚠️ 여기는 writing-mode 가 없어 px/py 가 평범하게 동작한다 —
                     위 세로축과 값이 뒤집혀 보이는 것이 정상이다
                     (가로 px-4 py-1.5  <->  세로 px-1.5 py-4). */}
              <div className="flex items-center justify-between rounded-full bg-surface px-5 py-1.5">
                <AxisArrow className="rotate-180" />
                <span className="text-13 font-bold leading-none text-ink-soft">
                  가격
                </span>
                <AxisArrow />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 6. 제품 영상 — videos.ts가 비어 있으면 통째로 렌더하지 않는다.
             여기는 맛보기 두 편만 걸고 나머지는 /videos 에서 본다.

          ⚠️ 회색 면이 위 흰 섹션 **위로 얹힌다**(-mt + 둥근 위 모서리).
             PRODUCTS 와 **같은 값**이다 — 회색 면 둘이 같은 규칙이어야
             우연이 아니라 체계로 읽힌다.

          ⚠️⚠️ {... && (} 바로 뒤에 JSX 주석을 두지 말 것. 주석과
                <Section> 이 **자식 둘**이 되어 "Expected '</', got 'ident'"
                로 빌드가 깨진다. 설명은 이 바깥 주석에 적는다. */}
      {featuredVideos.length > 0 && (
        <Section
          className="-mt-8 rounded-t-[2rem] sm:-mt-12 sm:rounded-t-[2.5rem]"
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
            // ⚠️ telMobile 은 2026-10-13 부터 **헤더 화면에 보이는** 번호다.
            //    화면에 나가는 번호가 여기서 빠지면 안 된다.
            telephone: [site.tel, site.telMobile, ...site.telExtra],
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

/**
 * POSITIONING 맵의 축 화살표. 기본은 오른쪽이고 className 의 rotate-* 로 돌린다
 * (위쪽 -90deg · 아래쪽 90deg · 왼쪽 180deg).
 *
 * ⚠️ 유니코드 글리프(↑ ← →)를 쓰지 않는 까닭: 폰트마다 굵기와 크기가 달라
 *    네 방향이 제각각으로 보인다. 같은 SVG 를 돌리면 넷이 똑같다.
 *
 * ⚠️ **사이트 공통 화살표**다(선 M5 12h14 + 화살촉). 아래 ArrowRight ·
 *    ContactCTA · NavPanel · ProductCard 가 쓰는 그 그림이라, 한 사이트에서
 *    "방향" 이 한 모양을 갖는다. 다른 모양(꺾쇠 등)으로 바꾸지 말 것.
 *
 * ⚠️ 동그라미로 감싸지 않는다. 원이 붙으면 버튼처럼 보여 "누를 수 있나" 로
 *    읽히고, 축 넷에 원이 생기면 미니멀과 멀어진다.
 *
 * ⚠️ aria-hidden 이다 — 방향의 뜻은 옆에 선 칩 글자가 전한다.
 */
function AxisArrow({ className = "" }: { className?: string }) {
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
      className={`shrink-0 text-muted ${className}`}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
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
