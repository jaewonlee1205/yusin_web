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
 */
export default function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      /* 쉴 때도 그림자를 얕게 깐다. 카드가 놓이는 바닥(bg-surface #f6f7f9)과
         카드(#ffffff)의 대비가 1.04 밖에 안 돼, 테두리만으로는 카드가 판에서
         떠 보이지 않는다. 포커스 링은 globals.css 가 a·button 전부에
         brand 색으로 이미 걸어 둔다 — 여기서 또 주지 않는다. */
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col border-t border-line p-5 sm:p-6">
        <p className="text-xs font-bold tracking-[0.15em] text-brand">
          {product.category}
        </p>
        <h3 className="mt-2 text-lg font-bold text-ink">{product.name}</h3>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-muted">
          {product.nameEn}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
          {product.summary}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy">
          상세보기
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
            className="transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
