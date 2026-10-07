import type { Metadata } from "next";
import { Nanum_Brush_Script } from "next/font/google";
import Image from "next/image";
import ContactCTA from "@/components/ContactCTA";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import {
  intro,
  overview,
  philosophy,
  philosophyMotto,
} from "@/data/company";
import { site, telHref, yearsInBusiness } from "@/data/site";

/**
 * 대표이사 서명 전용 붓글씨체. 이 페이지 서명 한 줄에서만 쓴다.
 *
 * 루트 레이아웃이 아니라 여기서 부르는 게 핵심이다. 레이아웃에서 부르면
 * 9개 페이지 전부가 @font-face 94개와 안 쓰는 라틴 서브셋 preload 14.3KB 를
 * 짊어진다. 여기서 부르면 그 94개가 /company 전용 CSS(gzip 15.1KB)로 빠져
 * 공용 CSS 가 gzip 24.0 -> 8.3KB 가 된다.
 *
 * preload: false — preload 대상은 라틴 서브셋인데 붓글씨로 쓰는 글자는
 * "이준희" 한글 3자뿐이라 한 글자도 안 쓴다. 한글 청크는 원래 preload 대상이
 * 아니고 브라우저가 필요할 때 받으므로, 이걸 꺼서 새로 생기는 FOUT 은 없다.
 *
 * subsets 에 "latin"만 적어도 한글이 나온다 — 구글이 내려 주는 CSS 가 한글
 * unicode-range 를 함께 담고 있고 next/font 가 그 파일들을 받아 자체
 * 호스팅하기 때문이다. (Noto Sans KR 도 같은 선언이다)
 */
const nanumBrush = Nanum_Brush_Script({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "회사소개",
  description: `1992년 설립 이후 ${yearsInBusiness}년간 파츠피더 한 분야만 만들어 온 유신 F.A 시스템입니다. 회사 소개와 개요, 사회복지·연구개발 두 갈래의 경영이념을 담았습니다.`,
};

export default function CompanyPage() {
  return (
    <>
      {/* 숫자는 yearsInBusiness 에서 뽑는다 — 해가 바뀌면 문구도 따라 바뀐다.
          "한 분야만 만들어 온 회사" 를 "한 분야에만 집중해 온 전문 제조사" 로
          바꿨다. 같은 사실이지만 거래처를 고르는 쪽이 찾는 말에 가깝다. */}
      <PageHero
        eyebrow="COMPANY"
        title="회사소개"
        lead={`1992년부터 ${yearsInBusiness}년, 파츠피더 한 분야에만 집중해 온 전문 제조사입니다.`}
      />

      {/* 회사 소개글 */}
      {/*
        Section 에 eyebrow·title 을 넘기지 않고 직접 그린다.

        ⚠️ 근거가 바뀌었다. 한때는 "Section 이 제목을 children 위 별도 블록에
           그려서 오른쪽 경영이념 패널이 제목보다 106px 아래에서 시작한다 —
           제목을 그리드 안에 넣어야 패널 윗변이 제목과 맞는다" 였는데, 그
           패널을 독립 섹션(아래 PHILOSOPHY)으로 빼내면서 그 말은 무효가 됐다.

           그런데도 Section 의 eyebrow·title 을 못 쓰는 이유는 따로 있다 —
           **h2 안에 로고 이미지가 들어간다**(아래 intro.title.brand 를 YUSIN
           마크로 대신한다). Section 의 title 은 string 만 받는다.

        eyebrow·h2 클래스는 src/components/Section.tsx 에서 그대로 옮겨 온 것이다.
        거기 타이포가 바뀌면 이 페이지도 같이 고쳐야 한다.

        ⚠️ max-w-3xl(768px)로 묶는다. 한때는 lg:grid-cols-[1.3fr_1fr] 의 왼쪽
           칸이라 폭이 저절로 잡혔는데, 패널이 빠져 1열이 되면서 그냥 두면
           한 줄이 1152px 까지 늘어난다. 읽는 글에는 너무 길다.
      */}
      <Section>
        <div className="max-w-3xl">
          <Reveal className="mb-3">
            <p className="text-xs font-bold tracking-[0.08em] text-brand">
              ABOUT
            </p>
          </Reveal>
          <Reveal>
            {/* 마지막 낱말을 로고의 YUSIN 마크로 대신한다.

                사이트에서 글 안에 이미지를 넣는 유일한 자리다 — 다른 Image 는
                전부 블록 컨테이너의 직계 자식이고, 브랜드도 읽는 글에서는 한글
                "유신" 으로만 쓴다(영문은 로고 이미지, 회사 개요 영문 부기,
                WHY YUSIN eyebrow 세 군데뿐). 여기 한 곳만의 예외로 두고 다른
                제목으로 번지지 않게 한다 — 번지면 한글 표기 규칙이 무너진다.

                alt 를 비우지 않는다. 이미지가 글자를 대신하므로 비우면 제목이
                "변화에 앞서가는 기업," 에서 끊겨 읽힌다.

                h-[0.78em] 로 글자 크기에 매어 둔다 — 24px 제목에서 19px,
                36px 에서 28px 로 따라 커진다. top 은 밑선을 맞추는 값이다
                (마크에 기울기와 꼬리가 있어 그냥 두면 살짝 뜬다). */}
            <h2 className="text-2xl font-bold leading-snug tracking-tight text-ink sm:text-4xl">
              {intro.title.lead}{" "}
              <Image
                src="/images/logo-mark.png"
                alt={intro.title.brand}
                width={129}
                height={32}
                className="relative top-[0.06em] inline-block h-[0.78em] w-auto align-baseline"
              />
            </h2>
            {/* 제목 아래 여백은 Section 의 헤더 아래 여백과 같은 값으로 맞춘다 */}
            <div className="mt-10 sm:mt-14">
              {intro.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 20)}
                  className={
                    // 첫 문단만 키워 소개글이 어디서 시작하는지 잡아 준다.
                    index === 0
                      ? "text-lg leading-[1.85] text-ink sm:text-xl"
                      : "mt-5 text-base leading-[1.9] text-ink-soft"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>

          {/*
            대표이사 서명.

            ⚠️ 한때 그리드의 둘째 행 첫 칸이었다(lg:col-start-1 lg:row-start-2).
               오른쪽 경영이념 패널이 stretch 로 따라 늘어나 네이비 빈 공간이
               145px 까지 벌어지는 것을 막던 배치인데, 그 패널을 독립 섹션으로
               빼내면서 행을 나눌 이유가 없어졌다. 지금은 소개글 바로 아래다 —
               그리드가 주던 gap-10 을 mt-10 이 대신한다.

            오른쪽은 이름을 붓글씨 글꼴로 그린 장식이라 aria-hidden 을 건다 —
            안 걸면 스크린리더가 "이준희"를 두 번 읽는다.
          */}
          <Reveal
            delay={140}
            className="mt-10 flex items-baseline gap-4 border-t border-line pt-6"
          >
            <span className="text-sm font-bold text-ink">
              대표이사 {site.ceo}
            </span>
            {/* 크게 + 자간을 벌려야 사인으로 읽힌다. 30px·자간 0 이면 세 글자가
                붙어 그냥 작은 손글씨가 된다. 기울기(rotate)는 일부러 안 넣었다 —
                이 글꼴에 이미 기울기가 있어 덧붙이면 삐뚤어져 보인다.
                font-bold 를 같이 걸면 안 된다 — 굵기가 400 하나뿐이라 브라우저가
                합성 볼드를 그려 붓획이 뭉갠다. */}
            <span
              aria-hidden="true"
              className={`${nanumBrush.className} sign-ink text-4xl leading-none tracking-[0.08em] text-ink sm:text-5xl`}
            >
              {site.ceo}
            </span>
          </Reveal>

        </div>
      </Section>

      {/* 경영이념.

          ⚠️ 한때 위 ABOUT 섹션 2열 그리드의 **오른쪽 네이비 패널**이었다
             (rounded-2xl bg-navy-deep p-7, 제목 아래 dl 로 두 항목이 세로로
             쌓였다). 좌우로 가르고 각각 사진을 넣어 달라는 요청에 독립 섹션
             으로 빼냈다 — 그 패널 안에서는 **사진이 들어가지 않는다.** 재 보면
             패널 안쪽이 1024 에서 319px 뿐이라, 좌우로 가르면 한 칸이 151px 이고
             16:9 사진이 85px 가 된다. 그 폭에 자막까지 얹으면 글이 사진을 덮는다
             (홈 PROCESS 자막이 152px 칸에서 12자가 한계였다).

             섹션으로 빼내니 한 칸이 1280 에서 564px, 사진이 317px 다.

          ⚠️ 그 대가로 ABOUT 섹션이 1열이 됐다. 오른쪽 1fr 칸이 비기 때문이다.
             요청에 없던 변화지만 패널을 빼면 피할 수 없다 — 되돌린다면 위
             max-w-3xl 과 서명의 mt-10 도 함께 본다.

          ⚠️ 흰 섹션 사이에 네이비가 끼는 것이 이 섹션의 또 다른 몫이다.
             아래 OVERVIEW 가 연락처 표 디자인으로 바뀌면서 tone="surface" 를
             걷어야 했는데(선뿐인 표라 회색 바탕에서 선이 사라진다), 그러면
             ABOUT 과 OVERVIEW 가 둘 다 흰 섹션이 되어 맞붙는다. 이 섹션이
             그 사이에 선다. **색을 바꾸거나 자리를 옮기면 OVERVIEW 도 같이
             본다.**

          eyebrow 가 영문(PHILOSOPHY)이다. 패널이던 때는 "섹션 eyebrow 가 이미
          ABOUT 이라 패널 안에 영문을 또 두면 한 섹션에 영문 라벨이 둘이 된다"
          는 이유로 한글 "경영이념" 을 썼는데, 제 섹션이 되면서 그 제약이
          사라졌다 — 사이트의 다른 모든 섹션이 영문 eyebrow + 한글 제목이다. */}
      <Section
        tone="navy"
        eyebrow="PHILOSOPHY"
        title="경영이념"
        lead={philosophyMotto}
      >
        <ul className="grid gap-6 sm:grid-cols-2">
          {philosophy.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 90}
              /* bg-white/5 — 네이비 위에서 칸 경계만 겨우 보이는 정도다. 더
                 올리면 카드가 상자로 읽혀 섹션이 무거워진다. */
              className="overflow-hidden rounded-2xl bg-white/5"
            >
              <p className="px-6 pt-6 text-sm font-bold text-brand-light">
                {item.title}
              </p>
              <div className="relative mt-4 aspect-video w-full bg-navy">
                <Image
                  src={item.photo}
                  alt={item.photoAlt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* 사진 위 자막. 홈 PROCESS 카드 · 제품 구동 영상과 같은 꼴이다
                    — 파란 그라데이션 위에 흰 글 한 줄.

                    ⚠️ <Image> 가 아니라 **칸**의 자식이다. 그래야 사진이 아직
                       안 떴거나 못 받았을 때도 띠가 남는다.

                    ⚠️ 글이 한 줄이어야 한다. 길이 규칙은 company.ts 의
                       philosophy 주석에 있다(1024 의 428px 가 최악).

                    px-5 pb-4 pt-12 — 홈 PROCESS(px-3 pb-2.5 pt-8)보다 크다.
                    거기는 사진이 99~119px 인데 여기는 234~317px 라, 같은
                    패딩을 쓰면 자막이 사진 구석에 붙어 보인다.

                    pointer-events-none — 누를 것이 없다. */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/40 to-transparent px-5 pb-4 pt-12">
                  <p className="text-sm font-medium leading-snug text-white">
                    {item.caption}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* 회사 개요 */}
      <Section eyebrow="OVERVIEW" title="회사 개요">
        {/*
          한 줄에 한 항목. **오시는 길 연락처 표와 같은 디자인이다** — 선뿐인
          목록(border-t 한 줄 + 행마다 border-b)이고 바탕도 그림자도 테두리도
          없다. 라벨은 13px 회색, 값은 15px 먹색이다. 사이트의 표가 세 가지
          다른 꼴이던 것을 하나로 모은 결과다.

          ⚠️ 그래서 **tone="surface" 를 쓸 수 없다.** 이 표는 선만으로 서므로
             회색 바탕 위에서는 border-line 이 대비 1.15:1 로 거의 사라진다.
             흰 섹션이어야 한다. 바로 위 PHILOSOPHY 가 네이비라 흰 섹션 둘이
             맞붙지는 않는다 — 그 섹션을 빼거나 색을 바꾸면 여기도 다시 본다.

          ⚠️ 라벨 폭이 w-16(64px), sm 부터 w-20(80px)이다. 13px bold 로 가장
             긴 라벨이 56.6px("제작 품목")이고 열셋 모두 80px 미만이라 들어간다.
             **라벨을 바꿀 때 이 80px 를 넘기지 말 것**(연락처 표도 같은 값이고
             거기 "사업자등록번호"(84px)는 못 들어간다고 적혀 있다).

          ⚠️ 2열로 접지 않는다. 연락처 표는 여섯 칸이라 lg:grid-cols-2 로
             접는데 여기는 열셋이고 "회사명 → 설립 → 자본금 …" 순서가 뜻을
             가져, 접으면 읽는 차례가 좌우로 갈린다.

          ── 아래는 이 표가 흰 카드 + 세로 구분선이던 때의 기록이다.
             되돌릴 일이 있으면 그때 측정값이 여기 남아 있다.

          · 라벨을 격자 고정 열(grid-cols-[7rem_1fr])에 두는 것이 핵심이었다 —
            값이 전부 같은 x 에서 시작해야 눈이 아래로만 내려간다. **그 성질은
            지금도 지켜진다.** flex 로 바뀌었지만 dt 가 w-16/sm:w-20 고정폭이고
            shrink-0 이라 값 시작점이 행마다 같다.
          · 세로 구분선(dt 의 border-r)을 쓰려면 세로 패딩을 행이 아니라
            dt/dd 가 들어야 했다 — 행에 패딩이 남으면 선이 위아래 14px 씩
            끊겨 점선처럼 보였다(실측 46%). **지금은 세로선 자체가 없어** 패딩이
            행(py-4)으로 돌아갔다.
          · 폭이 남는 게 아까워 값 길이에 맞춰 6열 격자로 나눈 적이 있는데,
            값 시작점이 행마다 달라져(실측 4종류) 훑기가 어려워졌다. 빈칸보다
            정렬선이 중요하다.
          · 라벨이 네이비였다. 지금은 연락처 표와 같은 text-muted 회색이다 —
            위계는 크기(13 vs 15px)가, 열 구분은 색이 맡는 방식 자체는 같다.
          · "sm:w-28 을 쓰면 안 된다(dt 폭이 고정돼 격자 열 설정을 덮어쓴다)"
            는 **무효다.** 격자가 아니라 flex 이므로 w-* 가 바로 그 방식이다.
        */}
        <dl className="grid border-t border-line">
          {/* 행 자체를 Reveal 로 만든다(as="div") — 래퍼가 끼면 dl > div > dt/dd
              구조가 깨진다. 45ms 씩 밀어 표가 한 줄씩 채워지게 한다.
              (연락처 표는 dl 전체가 한 겹의 Reveal 이다. 거기는 여섯 칸이고
              여기는 열셋이라 한 줄씩 채워지는 편이 길이를 덜 느끼게 한다.) */}
          {overview.map((row, i) => (
            <Reveal
              key={row.label}
              delay={i * 45}
              /* ⚠️ items-center 다. 대표번호처럼 값이 여러 줄인 행에서 라벨이
                 맨 위에 붙어 보였다(중심이 37px 위). 연락처 표도 같은 이유로
                 items-center 를 쓴다 — 거기는 2열 격자 행의 높이를 두 칸이
                 나눠 갖기 때문이고, 여기는 값 자체가 여러 줄이기 때문이다. */
              className="flex items-center gap-4 border-b border-line py-4"
            >
              <dt className="w-16 shrink-0 text-[13px] font-bold text-muted sm:w-20">
                {row.label}
              </dt>
              {/* tabular-nums: 대표번호와 팩스가 위아래로 붙어 있어 자릿수를
                  맞춰야 한다. 한글 값에는 아무 영향이 없다. */}
              <dd className="text-[15px] leading-relaxed tabular-nums text-ink">
                {/* 전화·이메일은 눌러서 걸고 보낼 수 있게 한다. 팩스는 걸 수
                    없어 href 가 없다 — 푸터·헤더·문의하기·오시는 길과 같은 규칙. */}
                {(Array.isArray(row.value) ? row.value : [row.value]).map(
                  (value, vi) => (
                    <span key={value} className="block">
                      {row.link ? (
                        <a
                          href={
                            row.link === "tel"
                              ? telHref(value)
                              : `mailto:${value}`
                          }
                          className="transition-colors hover:text-brand"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                      {/* 영문 상호는 링크 밖에, 첫 줄에 붙인다 */}
                      {vi === 0 && row.sub && (
                        <span className="ml-2.5 text-xs font-medium tracking-[0.08em] text-muted">
                          {row.sub}
                        </span>
                      )}
                    </span>
                  ),
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      <ContactCTA />
    </>
  );
}
