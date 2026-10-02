import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

/**
 * 제품 상세 페이지 아래 "다른 제품" 의 한 행. 상세 페이지에서만 쓴다.
 *
 * 세 번 모양이 바뀐 자리다. 처음에는 목록 페이지와 같은 세로 카드(347x437px)
 * 였는데 보조 목록인데 본문과 같은 무게였다. 그래서 가로 카드(352x98px)로
 * 줄였더니, 카드 안의 내용이 180px 에서 끝나 오른쪽 172px 가 비었고 그 빈 띠가
 * 세 열에 걸쳐 반복됐다. 지금은 전폭 한 줄이다 - 요약 문구가 가로를 채우고
 * 화살표가 오른쪽 끝을 닫는다.
 *
 * 테두리와 그림자가 없다. 감싸는 쪽(page.tsx)이 ul 하나에 테두리를 두고
 * divide-y 로 행을 나눈다. 행마다 테두리 + 간격 12px 로 두면 세 장이 336px
 * 인데 한 덩어리로 묶으면 254px 다. 호버는 테두리가 없으므로 행 배경으로 준다.
 *
 * 영문명은 넣지 않는다. 한때 넣었는데 컨트롤러의 "Parts Feeder Controller" 가
 * 230px 라 글 칸(211px)을 넘겨 혼자 잘렸다. 분류(최대 68px)와 제품명(최대
 * 73px "우레탄 코팅")만 두면 어느 행도 잘리지 않고, 영문명은 들어간 뒤 h1
 * 아래에 있다.
 *
 * 요약 문구는 1024 부터만 보인다. 가장 긴 tagline 이 417px(볼피더)인데 그 칸이
 * 1024 에서 633px, 1280 이상에서 840px 라 한 줄이지만 768 에서는 377px 로
 * 좁아져 두 줄이 된다. 두 줄이 되면 행 높이가 그 행만 커지므로 그 아래에서는
 * 숨긴다.
 *
 * 제품명 칸을 sm:w-36(144px) 로 못 박는다. 그래야 요약 문구가 모든 행에서 같은
 * x 에서 시작한다.
 */
export default function ProductRowCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex items-center gap-4 p-3 transition-colors hover:bg-surface"
    >
      {/* 원본이 모두 4:3 이라 contain 으로도 한 픽셀 잘리지 않는다. 받침을
          흰색으로 둬, 비율이 4:3 이 아닌 두 장(진동기 0.98, 컨트롤러 1.06)도
          회색 띠 없이 제품컷으로 보인다. */}
      <div className="relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded bg-white">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="80px"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="shrink-0 sm:w-36">
        <p className="text-[11px] font-bold tracking-[0.15em] text-brand">
          {product.category}
        </p>
        <h3 className="mt-0.5 text-[15px] font-bold text-ink transition-colors duration-300 group-hover:text-brand">
          {product.name}
        </h3>
      </div>

      <p className="hidden min-w-0 flex-1 text-sm leading-relaxed text-ink-soft lg:block">
        {product.tagline}
      </p>

      {/* ml-auto 로 끝에 붙인다. 요약 문구가 숨는 폭(1024 미만)에서는 flex-1
          짜리가 없어 화살표가 제품명 바로 뒤에 붙기 때문이다. */}
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
        className="ml-auto shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  );
}
