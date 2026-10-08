import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

/**
 * 제품 카드. /products 격자와 홈 '제품 라인업' 섹션이 함께 쓴다.
 *
 * 사진 칸에 여백을 두지 않는다. 전에는 object-contain + p-5 였는데, 사진이
 * 제 칸의 47~64% 만 채워(265x199 칸에 212x159, 진동기는 156x159) 회색 여백이
 * 사진보다 넓어 보였다. 여백을 걷으면 일곱 장 중 다섯 장이 칸을 정확히
 * 채운다 — 원본이 756x567, 1008x756 식으로 모두 4:3 이라 한 픽셀도 잘리지
 * 않는다.
 *
 * 확대 걱정은 없다. 가장 작은 원본(컨트롤러 520x490)도 가장 큰 표시
 * 크기(265x199)보다 크다. 어느 폭에서도 늘려 그리는 일이 없다.
 *
 * object-cover 는 쓰지 않는다. 비율이 4:3 이 아닌 두 장(진동기 0.98,
 * 컨트롤러 1.06)에서 세로가 26%, 20% 잘려 다리와 조작부가 날아간다.
 * contain 으로 두고, 받침을 카드와 같은 흰색으로 둔다 — 그래야 그 두 장이
 * 회색 띠를 두른 사진이 아니라 배경 없는 제품컷으로 보인다(진동기 원본이
 * 흰 배경 3D 도면이라 특히 잘 맞는다).
 *
 * 카드에는 분류 · 제품명 · 영문명 셋만 선다. 한때 그 아래 설명 두 줄
 * (tagline)이 있었는데 걷어 달라는 요청에 뺐다 — 세 자리가 같은 컴포넌트를
 * 쓰므로 여기 한 곳을 고치면 /products 7장, 홈 라인업 3장, 상세 "다른 제품"
 * 3장이 모두 바뀐다.
 *
 * 제품 상세의 "다른 제품" 도 이 카드를 그대로 쓴다. 한때 거기만 사진 칸을
 * 2:1 로 낮춘 적이 있는데(카드를 작게 두려고), 4:3 원본이 318px 칸에 212px 로
 * 그려져 좌우에 53px 씩 흰 띠가 남았다. 띠를 없애려면 칸이 원본과 같은 비율
 * 이어야 하므로 4:3 하나로 되돌리고, 크기는 그쪽 격자가 간격으로 잡는다.
 */
export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      /* 이제 그림자가 카드의 유일한 윤곽이다. 카드가 놓이는 바닥
         (bg-surface #f6f7f9)과 카드(#ffffff)의 대비가 1.04 밖에 안 되는데
         테두리까지 걷었으므로, shadow-card 가 빠지면 카드가 판에 녹는다.
         포커스 링은 globals.css 가 a·button 전부에 brand 색으로 이미 걸어
         둔다 — 여기서 또 주지 않는다. */
      /* ⚠️ h-full 은 오늘은 아무것도 바꾸지 않는다. 격자가 stretch 라
             Reveal(격자 항목)이 이미 줄 높이로 늘어나고, 카드 셋의 내용이
             분류·제품명·영문명 각 한 줄로 같아서 폭 일곱 종에서 높이 편차가
             0px 임을 재서 확인했다.

             제품명이 두 줄이 되는 날을 막는 보강이다. 그때는 그 카드만 길어
             지고 Reveal 은 늘어나는데 **안의 Link 는 안 늘어나** 나머지 카드
             아래에 흰 자리가 남는다. 홈과 상세 "다른 제품" 이 Reveal 로
             감싸는 쪽이고, /products 는 ProductCard 가 격자의 직접 자식이라
             원래 영향이 없다.

          ⚠️ 호버 그림자가 shadow-raised 다. 한때 Tailwind 기본
             hover:shadow-xl 이었는데 그 값은 순수 검정 기반이라, 쉴 때의
             shadow-card(ink)와 **색이 갈렸다.** 토큰 쪽 주석에 적어 뒀다. */
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-raised active:scale-[0.99] active:duration-100"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* 마우스를 올리면 사진 위로 떠오르는 "상세보기".
            사진 칸은 aspect-[4/3] 로 높이가 고정이고 이 겹은 absolute 라
            떠올라도 카드 높이가 1px 도 변하지 않는다. 참고한 신창에프에이는
            영문명을 감췄다 펼치는 방식인데, 호버할 때마다 카드가 404 -> 420px
            로 커져 같은 줄 카드 셋과 그 아래가 전부 밀린다. 자리를 사진 위로
            옮겨 그 흔들림을 없앴다.

            막은 navy-deep 65% 다. 눈대중이 아니라, 가장 밝은 사진(진동기 -
            흰 배경 3D 도면) 위에서도 흰 글자가 읽히는 값을 대비로 구했다.
            흰 바탕 기준 45%:2.73  55%:3.61  60%:4.18  65%:4.88  70%:5.71 이라,
            AA(4.5:1)를 넘기는 첫 값이 65% 다. 어두운 사진 위에서는 더 높다.

            pointer-events-none - 카드 전체가 이미 링크다. 이 겹이 클릭을
            가로채면 안 된다.

            aria-hidden 을 건다. 이 겹은 사진 칸 안에 있어 본문보다 앞서는데,
            그대로 두면 링크 이름이 "상세보기 파츠피더 볼피더 ..." 로 읽혀
            일곱 링크가 전부 같은 말로 시작한다. 보는 사람에게만 주는 신호라
            이름에서 뺀다 - 링크 이름은 제품명과 요약이 맡는다.

            터치 기기에서는 뜨지 않는다. Tailwind 가 hover: 를
            @media (hover:hover) 로 감싸기 때문이다. 그래서 카드 아래 "상세보기"
            줄을 지워도 정보는 잃지 않는다 - 분류.제품명.영문명.요약이
            그대로 보이고, 카드 전체가 누르는 자리다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-deep/65 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="flex translate-y-1 items-center gap-1.5 text-sm font-bold text-white transition-transform duration-300 group-hover:translate-y-0">
            상세보기
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
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-5 sm:p-6">
        <p className="text-xs font-bold tracking-[0.08em] text-brand">
          {product.category}
        </p>
        <h3 className="mt-2 text-lg font-bold text-ink transition-colors duration-300 group-hover:text-brand">
          {product.name}
        </h3>
        {/* ⚠️ flex-1 이 여기 있다. 글 칸(flex flex-1 flex-col)에서 늘어나는
               자식이 이것뿐이라, 빼면 글 칸이 내용 높이로 줄고 카드 아래에 빈
               흰 자리가 남는다 — 격자는 stretch 라 카드 외곽만 같은 높이가 되고
               안쪽이 들뜬다.

            ⚠️ 한때 이 아래에 tagline 한 줄이 더 있었다("흩어진 부품을 진동으로
               끌어올려 …"). 걷어 달라는 요청에 뺐고, flex-1 을 그 p 에서 이쪽으로
               옮겼다. 카드가 376 -> 319px 가 된다.

               tagline 데이터는 products.ts 에 그대로 있다 — 일곱 문장을 "어느
               폭에서나 두 줄" 로 맞추느라 폭 열 종에서 1px 씩 잰 값이라 되살릴
               때를 위해 남겼다. 그 주석도 함께 손봐 뒀다. */}
        <p className="mt-0.5 flex-1 text-xs font-medium uppercase tracking-wide text-muted">
          {product.nameEn}
        </p>
      </div>
    </Link>
  );
}
